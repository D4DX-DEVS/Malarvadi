#!/usr/bin/env node
/**
 * Put the local site on the internet with a Cloudflare Quick Tunnel
 * (https://try.cloudflare.com). No Cloudflare account, DNS records or
 * router changes are needed: cloudflared opens an outbound connection and
 * hands back a temporary https://<random-words>.trycloudflare.com URL.
 *
 *   npm run share              start the site (if needed) + the tunnel
 *   npm run share -- --json    one machine-readable JSON line on stdout
 *   npm run share -- --no-dev  tunnel only, for an already running site
 *   npm run share -- --port 3000
 *
 * The URL lives exactly as long as this process; Ctrl+C ends both.
 */

import { spawn, spawnSync } from "node:child_process";
import dns from "node:dns/promises";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TUNNEL_URL_RE = /https:\/\/[a-z0-9][a-z0-9-]*\.trycloudflare\.com/i;
const ALLOWED_FLAGS = new Set(["--json", "--no-dev", "--help", "-h"]);

const BINARY_CANDIDATES = [
  "/opt/homebrew/bin/cloudflared", // Homebrew, Apple silicon
  "/usr/local/bin/cloudflared", // Homebrew, Intel
  path.join(process.env.HOME ?? "", ".npm-global/bin/cloudflared"), // npm -g
  path.join(process.env.HOME ?? "", ".local/bin/cloudflared"),
];

function fail(message) {
  process.stderr.write(`\n${message}\n`);
  process.exit(1);
}

function usage() {
  process.stdout.write(
    [
      "Usage: npm run share [-- --json] [--no-dev] [--port <n>]",
      "",
      "  --json     print one JSON line with the public URL and keep logs on stderr",
      "  --no-dev   do not start `next dev`; assume the site is already running",
      "  --port     port the site listens on (default 3007)",
      "",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const options = { port: Number(process.env.PORT) || 3007, json: false, startDev: true };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--json") options.json = true;
    else if (arg === "--no-dev") options.startDev = false;
    else if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    } else if (arg === "--port") {
      const value = Number(argv[i + 1]);
      if (!Number.isInteger(value) || value <= 0 || value > 65535) fail(`Invalid --port value: ${argv[i + 1]}`);
      options.port = value;
      i += 1;
    } else if (arg.startsWith("--port=")) {
      const value = Number(arg.slice("--port=".length));
      if (!Number.isInteger(value) || value <= 0 || value > 65535) fail(`Invalid --port value: ${arg}`);
      options.port = value;
    } else if (!ALLOWED_FLAGS.has(arg)) {
      fail(`Unknown option: ${arg}\nRun with --help for usage.`);
    }
  }

  return options;
}

function findCloudflared() {
  const which = spawnSync("sh", ["-c", "command -v cloudflared"], { encoding: "utf8" });
  if (!which.error && which.status === 0) {
    const onPath = which.stdout.trim().split("\n")[0];
    if (onPath) return onPath;
  }
  return BINARY_CANDIDATES.find((candidate) => candidate && existsSync(candidate)) ?? null;
}

function portIsOpen(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });
    const settle = (value) => {
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(800);
    socket.once("connect", () => settle(true));
    socket.once("timeout", () => settle(false));
    socket.once("error", () => settle(false));
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForPort(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await portIsOpen(port)) return true;
    await sleep(400);
  }
  return false;
}

/**
 * A fresh quick Tunnel registers with the edge before Cloudflare publishes DNS
 * for its hostname, and Cloudflare throttles hostnames when tunnels are created
 * in quick succession. Report the difference instead of handing over a dead URL.
 */
async function publishedInDoh(host) {
  try {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${host}&type=A`, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return false;
    const body = await response.json();
    return body?.Status === 0 && Array.isArray(body.Answer) && body.Answer.length > 0;
  } catch {
    return false;
  }
}

async function hostnameIsPublished(host) {
  try {
    await dns.lookup(host);
    return true;
  } catch {
    // The local resolver caches NXDOMAIN for the zone's SOA TTL (30 minutes), so a
    // hostname can be live for everyone else while this machine still says no.
    return publishedInDoh(host);
  }
}

async function hostnameResolves(host, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    if (await hostnameIsPublished(host)) return true;
    if (Date.now() >= deadline) return false;
    await sleep(3000);
  }
}

const children = new Set();
let shuttingDown = false;

function aliveChildren() {
  return [...children].filter((child) => child.exitCode === null && child.signalCode === null);
}

function signal(child, name) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  try {
    child.kill(name);
  } catch {
    // already gone
  }
}

function stopAll(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  // Set the status right away: the process may exit naturally as soon as the
  // children stop holding the event loop open.
  process.exitCode = code;
  for (const child of children) signal(child, "SIGTERM");

  const escalate = setTimeout(() => {
    for (const child of children) signal(child, "SIGKILL");
    setTimeout(() => process.exit(code), 250);
  }, 3000);
  escalate.unref();

  const settle = setInterval(() => {
    if (aliveChildren().length > 0) return;
    clearInterval(settle);
    clearTimeout(escalate);
    process.exit(code);
  }, 100);
  settle.unref();
}

function prefixStream(stream, label, json) {
  if (!stream) return;
  let buffer = "";
  stream.setEncoding("utf8");
  stream.on("data", (chunk) => {
    if (json) {
      process.stderr.write(chunk); // keep stdout clean for the JSON line
      return;
    }
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) process.stdout.write(`${label} ${line}\n`);
  });
  stream.on("end", () => {
    if (!json && buffer) process.stdout.write(`${label} ${buffer}\n`);
  });
}

function run(command, args, label, cwd, json) {
  const child = spawn(command, args, { cwd, env: process.env, stdio: ["ignore", "pipe", "pipe"] });
  children.add(child);
  child.on("error", (error) => {
    children.delete(child);
    process.stderr.write(`\n${label.trim()} could not start ${command}: ${error.message}\n`);
    stopAll(1);
  });
  child.on("exit", () => children.delete(child));
  prefixStream(child.stdout, label, json);
  prefixStream(child.stderr, label, json);
  return child;
}

function banner({ origin, url, startedDev, json }) {
  if (json) {
    process.stdout.write(`${JSON.stringify({ url, origin, port: Number(new URL(origin).port) })}\n`);
    return;
  }
  const rule = "=".repeat(64);
  process.stdout.write(
    [
      "",
      rule,
      "  Malarvadi is live on the internet (Cloudflare Quick Tunnel)",
      `  Local    ${origin}`,
      `  Public   ${url}`,
      `  Started  ${startedDev ? "next dev + tunnel" : "tunnel only"}`,
      "  Stop     Ctrl+C: the public URL dies with this process",
      rule,
      "  This URL serves the whole app, /admin included. Anyone with the link",
      "  reaches the admin login, so keep ADMIN_PASSWORD strong.",
      "",
    ].join("\n"),
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const origin = `http://localhost:${options.port}`;

  const cloudflared = findCloudflared();
  if (!cloudflared) {
    fail(
      [
        "cloudflared is not installed.",
        "",
        "  brew install cloudflared",
        "  npm install -g cloudflared",
        "",
        "Then run `npm run share` again.",
      ].join("\n"),
    );
  }

  let startedDev = false;

  if (await portIsOpen(options.port)) {
    log(options, `Port ${options.port} is already serving, reusing it.`);
  } else if (!options.startDev) {
    fail(`Nothing is listening on ${origin}. Start the site first or drop --no-dev.`);
  } else {
    const nextBin = path.join(ROOT, "node_modules", ".bin", "next");
    if (!existsSync(nextBin)) fail("Could not find node_modules/.bin/next. Run `npm install` first.");

    log(options, `Starting the site on ${origin} ...`);
    const dev = run(nextBin, ["dev", "-p", String(options.port)], "[web]", ROOT, options.json);
    startedDev = true;
    dev.on("exit", (code) => {
      if (!shuttingDown) {
        process.stderr.write(`\n[web] exited with code ${code}.\n`);
        stopAll(code ?? 1);
      }
    });

    if (!(await waitForPort(options.port, 90_000))) {
      process.stderr.write("\nThe site did not start listening in time.\n");
      stopAll(1);
      return;
    }
  }

  log(options, "Opening the Quick Tunnel ...");

  // Exactly the command from https://try.cloudflare.com, pointed at our port.
  const tunnel = run(cloudflared, ["tunnel", "--url", origin], "[tunnel]", ROOT, options.json);
  let announced = false;

  const watch = (stream) => {
    if (!stream) return;
    let rest = "";
    stream.setEncoding("utf8");
    stream.on("data", (chunk) => {
      rest += chunk;
      if (announced) {
        rest = "";
        return;
      }
      const match = TUNNEL_URL_RE.exec(rest);
      if (match) {
        announced = true;
        rest = "";
        const url = match[0];
        banner({ origin, url, startedDev, json: options.json });
        hostnameResolves(new URL(url).hostname)
          .then((ok) => {
            if (ok) note(`${new URL(url).hostname} resolves. The public URL is live.`);
            else
              note(
                `${new URL(url).hostname} does not resolve yet. Cloudflare can take a moment, and it throttles\n` +
                  "       hostnames when several tunnels are created in quick succession. The tunnel is still\n" +
                  "       running, so try the URL again shortly.",
              );
          })
          .catch(() => {});
      } else if (rest.length > 8192) {
        rest = rest.slice(-1024);
      }
    });
  };
  watch(tunnel.stdout);
  watch(tunnel.stderr);

  tunnel.on("exit", (code) => {
    if (!shuttingDown) {
      process.stderr.write(`\n[tunnel] cloudflared exited with code ${code}.\n`);
      stopAll(code ?? 1);
    }
  });

  process.on("SIGINT", () => {
    process.stderr.write("\nClosing the tunnel ...\n");
    stopAll(0);
  });
  process.on("SIGTERM", () => stopAll(0));
}

function log(options, message) {
  if (!options.json) process.stdout.write(`${message}\n`);
}

// Status messages go to stderr so that --json keeps a single line on stdout.
function note(message) {
  process.stderr.write(`[share] ${message}\n`);
}

main().catch((error) => fail(error?.stack ?? String(error)));

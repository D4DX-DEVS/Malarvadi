function str(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: str("FRONTEND_URL", "http://localhost:3000"),
  mongoUri: str("MONGODB_URI", ""),
  // The site has a single admin. These two values are the whole account -
  // there is no users collection and no signup.
  adminEmail: str("ADMIN_EMAIL", "").trim().toLowerCase(),
  adminPassword: str("ADMIN_PASSWORD", ""),
  jwtSecret: str("JWT_SECRET", ""),
  isProd: (process.env.NODE_ENV ?? "development") === "production",
  spacesEndpoint: str("DO_SPACES_ENDPOINT", ""),
  spacesBucket: str("DO_SPACES_BUCKET", ""),
  spacesRegion: str("DO_SPACES_REGION", ""),
  spacesKey: str("DO_SPACES_KEY", ""),
  spacesSecret: str("DO_SPACES_SECRET", ""),
  cdnBaseUrl: str("DO_CDN_BASE_URL", ""),
};

export function spacesConfigured(): boolean {
  return Boolean(
    env.spacesEndpoint && env.spacesBucket && env.spacesKey && env.spacesSecret
  );
}

export function adminConfigured(): boolean {
  return Boolean(env.adminEmail && env.adminPassword && env.jwtSecret);
}

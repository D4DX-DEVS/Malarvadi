"use client";

import { useEffect, useState } from "react";

export function HealthCheck({
  frontendOk,
  backendLabel,
}: {
  frontendOk: string;
  backendLabel: string;
}) {
  const [backend, setBackend] = useState<string>("…");

  useEffect(() => {
    fetch("/api/v1/health")
      .then((r) => r.json())
      .then((j) => setBackend(j?.data?.status ?? JSON.stringify(j)))
      .catch((e) => setBackend(`unreachable (${String(e)})`));
  }, []);

  return (
    <div className="text-sm">
      <p>✅ {frontendOk}</p>
      <p>
        {backendLabel}: <code>{backend}</code>
      </p>
    </div>
  );
}

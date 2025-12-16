"use client";

import { useEffect, useState } from "react";

export default function PreviewPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`preview-${token}`);

    if (!stored) {
      setError("Preview data not found.");
      return;
    }

    const { domain, ip } = JSON.parse(stored);

    fetch("/api/preview-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain,
        ip,
        path: "/",
      }),
    })
      .then((res) => res.text())
      .then(setHtml)
      .catch(() =>
        setError("Failed to load preview from origin server.")
      );
  }, [token]);

  if (error) {
    return <div style={{ padding: 20 }}>{error}</div>;
  }

  return (
    <iframe
      sandbox="allow-same-origin allow-scripts allow-forms"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      srcDoc={html}
    />
  );
}

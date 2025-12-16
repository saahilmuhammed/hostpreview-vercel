"use client";

import { useEffect, useState } from "react";

export default function PreviewPage({ params }) {
  const { slug } = params;
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(`preview-${slug}`));

    if (!data) {
      setError("Preview data not found.");
      return;
    }

    fetch("/api/preview-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: data.domain,
        ip: data.ip,
        path: `/${slug}`,
      }),
    })
      .then((res) => res.text())
      .then(setHtml)
      .catch(() =>
        setError("Failed to load preview from origin server.")
      );
  }, [slug]);

  if (error) return <div>{error}</div>;

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

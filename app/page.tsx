"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [ip, setIp] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!domain || !ip) {
      alert("Domain and IP are required");
      return;
    }

    const slug = domain.replace(/\./g, "_");

    localStorage.setItem(
      `preview-${slug}`,
      JSON.stringify({ domain, ip })
    );

    router.push(`/preview/${slug}`);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>HostPreview (CDN Bypass)</h1>

      <p style={{ color: "#cc0000" }}>
        ⚠ HTTPS preview is not supported. This tool previews the
        origin server over HTTP only.
      </p>

      <input
        placeholder="Domain (example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Origin IP (1.2.3.4)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <br />
      <br />

      <button onClick={handleSubmit}>Preview Origin</button>
    </main>
  );
}

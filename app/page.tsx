"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [ip, setIp] = useState("");
  const router = useRouter();

  const handlePreview = () => {
    if (!domain || !ip) {
      alert("Domain and IP are required");
      return;
    }

    const token = domain.replace(/\./g, "_");

    localStorage.setItem(
      `preview-${token}`,
      JSON.stringify({ domain, ip })
    );

    router.push(`/preview/${token}`);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>HostPreview</h1>

      <p style={{ color: "red" }}>
        ⚠ HTTPS preview is not supported. Origin is loaded over HTTP.
      </p>

      <input
        placeholder="Domain (example.com)"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Origin IP (1.2.3.4)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <br /><br />

      <button onClick={handlePreview}>
        Preview Origin
      </button>
    </main>
  );
}

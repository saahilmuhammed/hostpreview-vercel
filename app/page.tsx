'use client';

import { FormEvent, useState } from 'react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');
  const [protocol, setProtocol] = useState('https');
  const [path, setPath] = useState('/');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Ready');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus('Connecting…');
    setPreviewUrl(null);

    const res = await fetch('/api/preview-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, ip, protocol, path }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.detail || 'Failed to generate preview link');
      setStatus('Error');
      return;
    }

    setPreviewUrl(data.previewUrl);
    setStatus('Loading website…');
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>HostPreview – Vercel Test</h1>
      <p>Status: {status}</p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
        <input
          placeholder="Domain (example.com)"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          required
        />
        <input
          placeholder="IP address (203.0.113.10)"
          value={ip}
          onChange={e => setIp(e.target.value)}
          required
        />
        <select value={protocol} onChange={e => setProtocol(e.target.value)}>
          <option value="https">https</option>
          <option value="http">http</option>
        </select>
        <input
          placeholder="Path (default /)"
          value={path}
          onChange={e => setPath(e.target.value)}
        />
        <button type="submit">Preview Website</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {previewUrl && (
        <section style={{ marginTop: '1.5rem' }}>
          <p>Preview URL: {previewUrl}</p>
          <iframe
            src={previewUrl}
            style={{ width: '100%', maxWidth: '900px', height: '500px', border: '1px solid #444' }}
            onLoad={() => setStatus('Ready')}
          />
        </section>
      )}
    </main>
  );
}


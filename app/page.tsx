'use client';

import { FormEvent, useState } from 'react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');
  const [protocol, setProtocol] = useState('');
  const [path, setPath] = useState('');
  const [status, setStatus] = useState('Ready');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'error' | 'success' | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);
    setStatus('Connecting…');
    setPreviewUrl(null);

    try {
      const res = await fetch('/api/preview-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          ip,
          protocol: protocol || null,
          path: path || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to generate preview link');
      }

      if (!data.previewUrl) {
        throw new Error('Preview URL not generated');
      }

      const fullUrl = data.previewUrl.startsWith('http')
        ? data.previewUrl
        : `${window.location.origin}${data.previewUrl}`;

      setPreviewUrl(fullUrl);
      setStatus('Loading website…');
    } catch (err: any) {
      setStatus('Error');
      setMessage(err.message || 'Unexpected error');
      setMessageType('error');
    }
  }

  function copyPreviewLink(url: string) {
    if (!url) return;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setMessage('Preview link copied to clipboard!');
        setMessageType('success');
      })
      .catch(() => {
        setMessage('Could not copy link');
        setMessageType('error');
      });
  }

  return (
    <html lang="en">
      <head>
        <title>HostPreview - Preview Websites with Custom IP Mapping</title>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='4' y='4' width='56' height='56' rx='16' ry='16' fill='%23DC4E07'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='central' font-family='Inter, system-ui, sans-serif' font-size='28' font-weight='700' fill='white'%3EHP%3C/text%3E%3C/svg%3E"
        />
        <link rel="icon" type="image/png" href="/logo-hp.png" />
      </head>
      <body>
        {/* Header */}
        <header className="header">
          <div className="brand">
            <div className="brand-logo">HP</div>
            <div className="brand-info">
              <h1>HostPreview</h1>
              <p>Preview websites with custom IP mapping</p>
            </div>
          </div>
          <div className="header-right">
            <div className="status-pill">
              <span className="status-dot" />
              <span>Proxy online</span>
            </div>
            <div className="user-pill">
              <div className="user-avatar">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 19c1.5-3 3.5-4.5 7-4.5s5.5 1.5 7 4.5" />
                </svg>
              </div>
              <span className="user-name">Guest</span>
            </div>
          </div>
        </header>

        {/* Main unified block */}
        <main className="main-block">
          <div className="block-content">
            {/* Connection Details (left) */}
            <section className="section">
              <div className="section-header">
                <div className="section-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Connection Details</h2>
                  <p className="section-subtitle">How the preview works</p>
                </div>
              </div>

              <div className="info-list">
                <div className="info-item">
                  <div className="info-label">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Resolver mode
                  </div>
                  <div className="info-value">Host header override via proxy</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Protocol fallback
                  </div>
                  <div className="info-value">HTTPS → HTTP if SSL fails</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    Assets
                  </div>
                  <div className="info-value">Relative URLs rewritten into preview tunnel</div>
                </div>
              </div>

              <div className="tips-section">
                <h3 className="tips-title">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                  </svg>
                  Tips
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <div className="info-label">SSL issues?</div>
                    <div className="info-value">
                      Force http protocol if origin has invalid cert.
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Path</div>
                    <div className="info-value">
                      Target a specific app path like /admin or /staging.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Preview Workspace (middle) */}
            <section className="section">
              <div className="section-header">
                <div className="section-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Preview Workspace</h2>
                  <p className="section-subtitle">
                    Configure target host for live preview
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <label className="field-label" htmlFor="domain">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Domain
                    </label>
                    <input
                      type="text"
                      id="domain"
                      name="domain"
                      placeholder="example.com"
                      required
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="ip">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" />
                        <line x1="6" y1="18" x2="6.01" y2="18" />
                      </svg>
                      IP Address
                    </label>
                    <input
                      type="text"
                      id="ip"
                      name="ip"
                      placeholder="192.168.1.1"
                      required
                      value={ip}
                      onChange={e => setIp(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="protocol">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Protocol (optional)
                    </label>
                    <select
                      id="protocol"
                      name="protocol"
                      value={protocol}
                      onChange={e => setProtocol(e.target.value)}
                    >
                      <option value="">Auto (HTTPS → HTTP)</option>
                      <option value="https">https</option>
                      <option value="http">http</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field-label" htmlFor="path">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      Path (optional)
                    </label>
                    <input
                      type="text"
                      id="path"
                      name="path"
                      placeholder="/admin"
                      value={path}
                      onChange={e => setPath(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="submit-btn" id="submitBtn">
                    Preview Website
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </form>

              <div className="status-bar">
                <span className="ready-dot" />
                <span className="status-text" id="statusText">
                  {status}
                </span>
              </div>
              <div id="message">
                {message && (
                  <p className={messageType === 'error' ? 'error-message' : 'success-message'}>
                    {message}
                  </p>
                )}
              </div>
            </section>

            {/* Live Preview (right) */}
            <section className="section">
              <div className="section-header">
                <div className="section-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div>
                  <h2 className="section-title">Live Preview</h2>
                  <p className="section-subtitle">Real-time website preview</p>
                </div>
              </div>

              <div className="preview-container">
                {previewUrl ? (
                  <iframe src={previewUrl} />
                ) : (
                  <p className="preview-placeholder">
                    Enter a domain, IP, protocol and path to preview the website
                  </p>
                )}
              </div>

              <div
                className="preview-toolbar"
                style={{ display: previewUrl ? 'flex' : 'none' }}
              >
                <div className="toolbar-url">{previewUrl || ''}</div>
                <button
                  className="toolbar-btn"
                  type="button"
                  onClick={() => previewUrl && copyPreviewLink(previewUrl)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy URL
                </button>
                <button
                  className="toolbar-btn"
                  type="button"
                  onClick={() => previewUrl && window.open(previewUrl, '_blank')}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in New Tab
                </button>
              </div>
            </section>
          </div>
        </main>

        {/* Background word below block */}
        <div className="ghost-text-container">
          <span className="ghost-text">HostPreview</span>
        </div>
      </body>
    </html>
  );
}

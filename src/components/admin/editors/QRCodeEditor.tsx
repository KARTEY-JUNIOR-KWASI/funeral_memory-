import { useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import type { Memorial } from '../../../types/memorial';

interface Props {
  memorial: Memorial;
  deployedBaseUrl: string; // e.g. https://your-app.vercel.app
}

const SIZES = [
  { label: 'Small (512px) — Screen use', value: 512 },
  { label: 'Medium (1024px) — Print A5/A6', value: 1024 },
  { label: 'Large (2048px) — Print A4/A3', value: 2048 },
];

export default function QRCodeEditor({ memorial, deployedBaseUrl }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(512);
  const [copied, setCopied] = useState(false);
  const [includeLabel, setIncludeLabel] = useState(true);

  const memorialUrl = `${deployedBaseUrl}/memorial/${memorial.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(memorialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: select text */
    }
  };

  // Download the QR code as a PNG via the hidden canvas
  const downloadPNG = () => {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `memorial-qr-${memorial.slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Download as SVG (inline the SVG element)
  const downloadSVG = () => {
    const svg = document.getElementById('qr-svg-export');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `memorial-qr-${memorial.slug}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', lineHeight: 'var(--leading-relaxed)' }}>
          This QR code links directly to the public memorial. Print it on the funeral brochure, order of service, or floral card. When guests scan it, they are taken straight to the memorial — no app required.
        </p>
      </div>

      {/* URL display */}
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: 'var(--space-2)' }}>
          Memorial URL
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200, padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text)', wordBreak: 'break-all' }}>
            {memorialUrl}
          </div>
          <button
            onClick={copyLink}
            style={{ padding: 'var(--space-3) var(--space-5)', background: copied ? 'var(--color-gold-pale)' : 'var(--color-ink)', color: copied ? 'var(--color-gold-muted)' : '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)', transition: 'all var(--transition-base)', flexShrink: 0 }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
          <a
            href={memorialUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textDecoration: 'none', letterSpacing: 'var(--tracking-wide)', flexShrink: 0 }}
          >
            View ↗
          </a>
        </div>
      </div>

      {/* QR Preview */}
      <div style={{ display: 'flex', gap: 'var(--space-8)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* QR Code with optional label */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div
            style={{
              background: '#fff',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            {/* Visible preview — always 256px */}
            <QRCodeSVG
              value={memorialUrl}
              size={256}
              level="H"
              marginSize={2}
              style={{ display: 'block' }}
            />
            {includeLabel && (
              <div style={{ textAlign: 'center', maxWidth: 256 }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 13, color: '#1a1a1a', letterSpacing: '0.05em' }}>
                  Scan to view the memorial of
                </p>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginTop: 2 }}>
                  {memorial.full_name}
                </p>
              </div>
            )}
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', textAlign: 'center' }}>
            Preview (256px) — download at full resolution below
          </p>
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 240, display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Label toggle */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: 'var(--space-3)' }}>
              Options
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeLabel}
                onChange={(e) => setIncludeLabel(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: 'var(--color-ink)', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                Include name label under QR code
              </span>
            </label>
          </div>

          {/* Download size */}
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-ink)', marginBottom: 'var(--space-3)' }}>
              Download Resolution
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {SIZES.map(s => (
                <label key={s.value} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="qr-size"
                    value={s.value}
                    checked={size === s.value}
                    onChange={() => setSize(s.value)}
                    style={{ accentColor: 'var(--color-ink)', cursor: 'pointer' }}
                  />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                    {s.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Download buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
              Download
            </p>
            <button
              onClick={downloadPNG}
              style={{ padding: 'var(--space-3) var(--space-5)', background: 'var(--color-ink)', color: '#f5f0eb', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', letterSpacing: 'var(--tracking-wide)', textAlign: 'left' }}
            >
              ⬇ Download PNG — for digital use & WhatsApp
            </button>
            <button
              onClick={downloadSVG}
              style={{ padding: 'var(--space-3) var(--space-5)', background: 'none', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--color-text-muted)', letterSpacing: 'var(--tracking-wide)', textAlign: 'left' }}
            >
              ⬇ Download SVG — for print designers (infinitely scalable)
            </button>
          </div>

          <div style={{ background: 'var(--color-gold-pale)', border: '1px solid var(--color-gold-light)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-gold-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              💡 <strong>Tip for printers:</strong> Use the SVG file for best quality. Send it to your graphic designer or paste it directly into Canva or Adobe InDesign for the funeral brochure.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden full-resolution canvas for PNG export */}
      <div ref={canvasRef} style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <QRCodeCanvas
          value={memorialUrl}
          size={size}
          level="H"
          marginSize={4}
        />
      </div>

      {/* Hidden SVG for SVG export */}
      <div style={{ position: 'absolute', left: -9999, top: -9999, opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
        <QRCodeSVG
          id="qr-svg-export"
          value={memorialUrl}
          size={size}
          level="H"
          marginSize={4}
        />
      </div>
    </div>
  );
}

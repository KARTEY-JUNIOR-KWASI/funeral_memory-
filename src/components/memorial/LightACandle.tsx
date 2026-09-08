import { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface Props {
  memorialId: string;
  memorialName: string;
  initialCount: number;
}

export default function LightACandle({ memorialId, memorialName, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [lit, setLit] = useState(false);
  const [loading, setLoading] = useState(false);
  const alreadyLitRef = useRef(false);

  // Check if user already lit a candle this session
  useEffect(() => {
    const key = `candle_lit_${memorialId}`;
    if (sessionStorage.getItem(key) === '1') {
      setLit(true);
      alreadyLitRef.current = true;
    }
  }, [memorialId]);

  const lightCandle = async () => {
    if (lit || loading) return;

    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        // Call the candle insert — rate limiting via RLS + backend
        const { error } = await supabase.from('candles').insert({
          memorial_id: memorialId,
          ip_hash: 'client-side', // server-side hashing in Edge Function
          fingerprint: navigator.userAgent.slice(0, 50),
        });
        if (error) throw error;
      }

      setCount(c => c + 1);
      setLit(true);
      sessionStorage.setItem(`candle_lit_${memorialId}`, '1');
    } catch (err) {
      console.error('Failed to light candle:', err);
      // Still show the animation locally even if API fails
      setCount(c => c + 1);
      setLit(true);
    } finally {
      setLoading(false);
    }
  };

  const firstName = memorialName.split(' ')[0];

  return (
    <section id="candle" style={{ background: 'var(--color-ink)', padding: 'var(--space-16) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto', padding: '0 var(--space-5)' }}>
          {/* Heading */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--color-gold)', marginBottom: 'var(--space-3)' }}>
            A Small Act of Remembrance
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(var(--text-2xl), 5vw, var(--text-4xl))', color: '#f5f0eb', marginBottom: 'var(--space-8)' }}>
            Light a Candle
          </h2>

          {/* Candle SVG */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 'var(--space-8)',
            }}
          >
            {/* Flame */}
            <div
              style={{
                width: 20,
                height: 32,
                background: lit
                  ? 'radial-gradient(ellipse at 50% 80%, #fde68a, #f59e0b 40%, #d97706 80%, transparent)'
                  : 'rgba(255,255,255,0.08)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                marginBottom: 2,
                animation: lit ? 'candleFlicker 2.5s ease-in-out infinite' : 'none',
                transition: 'background 0.6s ease',
                transformOrigin: 'bottom center',
                boxShadow: lit ? '0 0 20px 8px rgba(245,158,11,0.3)' : 'none',
              }}
              aria-hidden="true"
            />
            {/* Wick */}
            <div
              style={{
                width: 2,
                height: 8,
                background: lit ? 'var(--color-candle)' : 'rgba(255,255,255,0.15)',
                borderRadius: 1,
                marginBottom: 0,
                transition: 'background 0.4s ease',
              }}
              aria-hidden="true"
            />
            {/* Candle body */}
            <div
              style={{
                width: 32,
                height: 80,
                background: lit
                  ? 'linear-gradient(to bottom, #f5f0eb, #e8e3dc)'
                  : 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                borderRadius: '3px 3px 2px 2px',
                transition: 'background 0.6s ease',
                boxShadow: lit ? '0 0 16px 4px rgba(245,158,11,0.15)' : 'none',
                position: 'relative',
              }}
              aria-hidden="true"
            >
              {/* Wax drip */}
              {lit && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 8,
                    width: 6,
                    height: 12,
                    background: '#e8e3dc',
                    borderRadius: '0 0 4px 4px',
                  }}
                />
              )}
            </div>
            {/* Base */}
            <div
              style={{
                width: 44,
                height: 6,
                background: lit ? 'rgba(181,146,74,0.4)' : 'rgba(255,255,255,0.06)',
                borderRadius: '0 0 4px 4px',
                transition: 'background 0.6s ease',
              }}
              aria-hidden="true"
            />
          </div>

          {/* State: before lit */}
          {!lit && (
            <button
              onClick={lightCandle}
              disabled={loading}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                letterSpacing: 'var(--tracking-wider)',
                padding: 'var(--space-4) var(--space-8)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(181,146,74,0.5)',
                background: 'transparent',
                color: loading ? 'rgba(245,240,235,0.4)' : '#f5f0eb',
                cursor: loading ? 'wait' : 'pointer',
                transition: 'all var(--transition-base)',
                marginBottom: 'var(--space-6)',
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(181,146,74,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(181,146,74,0.8)';
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(181,146,74,0.5)';
              }}
            >
              {loading ? 'Lighting…' : '🕯 Light a Candle'}
            </button>
          )}

          {/* State: after lit */}
          {lit && (
            <div style={{ animation: 'fadeUp 0.6s ease both' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'var(--text-xl)', color: '#f5f0eb', marginBottom: 'var(--space-2)' }}>
                Your candle has been lit in memory of {firstName}.
              </p>
            </div>
          )}

          {/* Candle count */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'rgba(245,240,235,0.4)', letterSpacing: 'var(--tracking-wide)' }}>
            <strong style={{ color: 'var(--color-gold)', fontWeight: 400 }}>{count.toLocaleString()}</strong>
            {' '}candle{count !== 1 ? 's' : ''} lit
          </p>
        </div>
      </div>
    </section>
  );
}

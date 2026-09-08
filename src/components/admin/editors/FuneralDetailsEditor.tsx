import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { FuneralDetails } from '../../../types/memorial';

interface Props {
  memorialId: string;
  details: FuneralDetails | null;
}

export default function FuneralDetailsEditor({ memorialId, details }: Props) {
  const [serviceDate, setServiceDate] = useState(details?.service_date || '');
  const [serviceTime, setServiceTime] = useState(details?.service_time || '');
  const [venueName, setVenueName] = useState(details?.venue_name || '');
  const [address, setAddress] = useState(details?.address || '');
  const [city, setCity] = useState(details?.city || '');
  const [country, setCountry] = useState(details?.country || '');
  const [mapsUrl, setMapsUrl] = useState(details?.maps_url || '');
  const [notes, setNotes] = useState(details?.additional_notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        memorial_id: memorialId,
        service_date: serviceDate || null,
        service_time: serviceTime || null,
        venue_name: venueName.trim() || null,
        address: address.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        maps_url: mapsUrl.trim() || null,
        additional_notes: notes.trim() || null,
      };

      if (details?.id) {
        const { error: e } = await supabase.from('funeral_details').update(payload).eq('id', details.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase.from('funeral_details').insert(payload);
        if (e) throw e;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save funeral details.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-3) var(--space-4)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-ink)',
    background: 'var(--color-surface)',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-xs)',
    fontWeight: 600,
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    color: 'var(--color-ink)',
    marginBottom: 'var(--space-2)',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
        Service information shown at the bottom of the public memorial with a "Get Directions" button.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <label style={labelStyle}>Date of Service</label>
          <input type="date" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Time</label>
          <input type="time" value={serviceTime} onChange={(e) => setServiceTime(e.target.value)} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Venue Name</label>
        <input type="text" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="e.g. Labadi Presbyterian Church" maxLength={200} style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div>
        <label style={labelStyle}>Street Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. 12 Church Road" maxLength={200} style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <label style={labelStyle}>City / District</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Accra" maxLength={100} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
        <div>
          <label style={labelStyle}>Country</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Ghana" maxLength={80} style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Google Maps URL</label>
        <input type="url" value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/..." style={inputStyle}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-1)' }}>
          Paste a Google Maps share link. Visitors will see a "Get Directions" button.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Additional Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Dress code: Black & white. Reception to follow at the family home."
          rows={3}
          maxLength={600}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-gold)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
        />
      </div>

      {error && <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }}>{error}</p>}

      <div>
        <button
          onClick={handleSave} disabled={saving}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: saved ? 'var(--color-gold-pale)' : saving ? 'var(--color-border)' : 'var(--color-ink)',
            color: saved ? 'var(--color-gold-muted)' : '#f5f0eb',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: 'var(--tracking-wide)',
          }}
        >
          {saving ? 'Saving...' : saved ? '✓ Details Saved' : 'Save Service Details'}
        </button>
      </div>
    </div>
  );
}

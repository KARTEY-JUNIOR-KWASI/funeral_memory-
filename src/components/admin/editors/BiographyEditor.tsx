import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Biography } from '../../../types/memorial';

interface Props {
  memorialId: string;
  biography: Biography | null;
}

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      style={{
        padding: 'var(--space-2) var(--space-3)',
        background: active ? 'var(--color-gold-pale)' : 'none',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        color: active ? 'var(--color-gold-muted)' : 'var(--color-text-muted)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 600 : 400,
        lineHeight: 1,
        transition: 'all var(--transition-fast)',
      }}
    >
      {children}
    </button>
  );
}

export default function BiographyEditor({ memorialId, biography }: Props) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write the life story here. Share who they were, what they loved, and the legacy they leave behind…' }),
    ],
    content: biography?.content || '',
  });

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    setError('');

    const content = editor.getHTML();

    try {
      if (biography?.id) {
        const { error: dbErr } = await supabase
          .from('biographies')
          .update({ content })
          .eq('id', biography.id);
        if (dbErr) throw dbErr;
      } else {
        const { error: dbErr } = await supabase
          .from('biographies')
          .insert({ memorial_id: memorialId, content });
        if (dbErr) throw dbErr;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)',
        padding: 'var(--space-2)',
        border: '1px solid var(--color-border)',
        borderBottom: 'none',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        background: 'var(--color-surface)',
      }}>
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></ToolbarButton>
        <div style={{ width: 1, background: 'var(--color-border)', margin: '0 var(--space-1)' }} />
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</ToolbarButton>
        <div style={{ width: 1, background: 'var(--color-border)', margin: '0 var(--space-1)' }} />
        <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</ToolbarButton>
        <ToolbarButton title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</ToolbarButton>
        <div style={{ width: 1, background: 'var(--color-border)', margin: '0 var(--space-1)' }} />
        <ToolbarButton title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>—</ToolbarButton>
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>↩</ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>↪</ToolbarButton>
      </div>

      {/* Editor area */}
      <div style={{
        border: '1px solid var(--color-border)',
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        minHeight: 360,
        padding: 'var(--space-5)',
        background: 'var(--color-surface-card)',
        cursor: 'text',
      }}
        onClick={() => editor.chain().focus().run()}
      >
        <style>{`
          .ProseMirror { outline: none; min-height: 300px; font-family: var(--font-body); font-size: var(--text-base); line-height: var(--leading-loose); color: var(--color-text); }
          .ProseMirror p { margin-bottom: var(--space-4); }
          .ProseMirror h2 { font-family: var(--font-display); font-size: var(--text-2xl); color: var(--color-ink); margin: var(--space-6) 0 var(--space-3); font-weight: 400; }
          .ProseMirror h3 { font-family: var(--font-display); font-size: var(--text-xl); color: var(--color-ink); margin: var(--space-4) 0 var(--space-2); font-weight: 400; }
          .ProseMirror blockquote { border-left: 3px solid var(--color-gold); padding: var(--space-3) var(--space-5); margin: var(--space-6) 0; background: var(--color-gold-pale); border-radius: 0 var(--radius-md) var(--radius-md) 0; font-style: italic; }
          .ProseMirror ul { padding-left: var(--space-6); margin-bottom: var(--space-4); }
          .ProseMirror li { margin-bottom: var(--space-2); }
          .ProseMirror hr { border: none; border-top: 1px solid var(--color-border); margin: var(--space-8) 0; }
          .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: var(--color-text-faint); font-style: italic; pointer-events: none; float: left; height: 0; }
        `}</style>
        <EditorContent editor={editor} />
      </div>

      {error && <p style={{ color: '#b91c1c', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>{error}</p>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            background: saved ? 'var(--color-gold-pale)' : saving ? 'var(--color-border)' : 'var(--color-ink)',
            color: saved ? 'var(--color-gold-muted)' : '#f5f0eb',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
            cursor: saving ? 'not-allowed' : 'pointer',
            letterSpacing: 'var(--tracking-wide)',
            transition: 'all var(--transition-base)',
          }}
        >
          {saving ? 'Saving...' : saved ? '✓ Biography Saved' : 'Save Biography'}
        </button>
        {!saving && !saved && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>
            Changes are not saved automatically.
          </p>
        )}
      </div>
    </div>
  );
}

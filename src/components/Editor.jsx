import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'

function Editor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor-content',
            },
        },
    })

    if (!editor) {
        return null
    }

    return (
        <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '12px',
                borderBottom: '1px solid var(--border)',
                background: '#f9fafb',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    style={{ padding: '6px 12px', fontWeight: 'bold', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: editor.isActive('bold') ? '#e5e7eb' : '#fff' }}
                >
                    Ж
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    style={{ padding: '6px 12px', fontStyle: 'italic', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: editor.isActive('italic') ? '#e5e7eb' : '#fff' }}
                >
                    К
                </button>

                <span style={{ borderLeft: '1px solid #ccc', margin: '0 4px', height: '24px' }}></span>

                {['#3a4a52', '#c62828', '#1565c0', '#2e7d32', '#d6a4b2', '#e67e22', '#8e44ad'].map(color => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => editor.chain().focus().setColor(color).run()}
                        style={{ width: '24px', height: '24px', background: color, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', cursor: 'pointer' }}
                        title={color}
                    />
                ))}

                <span style={{ borderLeft: '1px solid #ccc', margin: '0 4px', height: '24px' }}></span>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    style={{ padding: '6px 12px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', fontSize: '0.85rem', marginLeft: 'auto' }}
                >
                    Очистить
                </button>
            </div>

            <div style={{ padding: '16px', minHeight: '150px', fontSize: '1.1rem', color: '#3a4a52' }}>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}

export default Editor
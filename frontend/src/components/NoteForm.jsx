import React from 'react';

export default function NoteForm({
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
  onCancel,
  loading,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
}) {
  return (
    <form onSubmit={onSubmit} className="add-note-form" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      background: '#f8faff',
      borderRadius: 14,
      boxShadow: '0 2px 12px rgba(38,117,252,0.07)',
      padding: '24px 32px',
      margin: '12px 0 8px 0',
      width: '100%',
      maxWidth: 'none',
      marginLeft: 0,
      marginRight: 0,
      boxSizing: 'border-box',
    }}>
      <input
        type="text"
        value={title}
        onChange={onTitleChange}
        maxLength={60}
        required
        style={{
          fontSize: '1.1rem',
          padding: '10px 0 6px 0',
          border: 'none',
          borderBottom: '2px solid #2575fc',
          borderRadius: 0,
          marginBottom: 0,
          width: '100%',
          boxSizing: 'border-box',
          fontWeight: 600,
          background: 'transparent',
          color: '#222',
          outline: 'none',
          boxShadow: 'none',
          transition: 'border-bottom 0.2s',
        }}
      />
      <textarea
        value={content}
        onChange={onContentChange}
        required
        rows={8}
        style={{
          fontSize: '1.08rem',
          padding: '12px',
          borderRadius: 8,
          border: '1px solid #b5c6e0',
          minHeight: 80,
          resize: 'vertical',
          width: '100%',
          boxSizing: 'border-box',
          background: '#fff',
          marginBottom: 0,
        }}
      />
      <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(90deg, #2575fc 0%, #6a11cb 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontSize: '1.08rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(38,117,252,0.10)',
            transition: 'background 0.2s, box-shadow 0.2s',
            opacity: loading ? 0.7 : 1,
          }}
        >{loading ? 'Saving...' : submitLabel}</button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: '#fff',
            color: '#2575fc',
            border: '1.5px solid #2575fc',
            borderRadius: 8,
            padding: '12px 28px',
            fontSize: '1.08rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(38,117,252,0.04)',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >{cancelLabel}</button>
      </div>
    </form>
  );
}

import React from 'react';

export default function NoteCard({
  note,
  expanded,
  editing,
  onExpand,
  onEdit,
  onDelete,
  children
}) {
  return (
    <div
      className={`note-card${expanded ? ' expanded' : ''}`}
      style={{ cursor: 'pointer' }}
      onClick={e => {
        if (!editing) {
          if (expanded) {
            e.stopPropagation();
          } else {
            onExpand(note._id);
          }
        }
      }}
    >
      {editing ? (
        children
      ) : (
        <>
          <div className="note-title">
            <span className="note-title-text">{note.title}</span>
            <div className="note-actions">
              <button
                className="edit-btn"
                title="Edit"
                onClick={e => { e.stopPropagation(); onEdit(note); }}
              >
                <span role="img" aria-label="Edit">✏️</span>
              </button>
              <button
                className="delete-btn"
                title="Delete"
                onClick={e => { e.stopPropagation(); onDelete(note._id); }}
              >
                <span role="img" aria-label="Delete">🗑️</span>
              </button>
            </div>
          </div>
          <div className="note-content" style={{
            overflow: expanded ? 'visible' : 'hidden',
            textOverflow: expanded ? 'unset' : 'ellipsis',
            whiteSpace: expanded ? 'pre-wrap' : 'nowrap',
            maxHeight: expanded ? 'none' : 40
          }}>
            {note.content}
          </div>
        </>
      )}
    </div>
  );
}

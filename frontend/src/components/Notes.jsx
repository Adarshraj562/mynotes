
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './Notes.css';
import Login from './Login';
import NoteForm from './NoteForm';
import NoteCard from './NoteCard';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [adding, setAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const expandedNoteRef = useRef(null);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/notes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotes(res.data);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch notes if logged in (token exists)
    if (loggedIn) {
      fetchNotes();
    }
  }, [loggedIn]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/note/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotes(notes.filter(note => note._id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      setError('Network error');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/notes', { title, content }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotes([res.data, ...notes]);
      setShowForm(false);
      setTitle('');
      setContent('');
    } catch {
      setError('Network error');
    } finally {
      setAdding(false);
    }
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    setEditId(null);
  };

  const handleEdit = (note) => {
    if (expandedId !== note._id) {
      setExpandedId(note._id);
      setTimeout(() => {
        setEditId(note._id);
        setEditTitle(note.title);
        setEditContent(note.content);
      }, 10); // Wait for expand animation
    } else {
      setEditId(note._id);
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  };

  const handleEditSave = async (id) => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5000/note/${id}`, { title: editTitle, content: editContent }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotes(notes.map(note => note._id === id ? res.data : note));
      setEditId(null);
      setExpandedId(null); // Collapse after save
    } catch {
      setError('Network error');
    }
  };

  useEffect(() => {
    if (expandedId !== null) {
      const handleClickOutside = (event) => {
        if (
          expandedNoteRef.current &&
          !expandedNoteRef.current.contains(event.target)
        ) {
          // Never collapse if editing
          if (!editId) {
            setExpandedId(null);
          }
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [expandedId, editId]);

  // If error is 403, log out and redirect to login
  useEffect(() => {
    if (error && error.toLowerCase().includes('forbidden')) {
      localStorage.removeItem('token');
      setLoggedIn(false);
    }
  }, [error]);

  if (!loggedIn) {
    return <Login onLogin={() => {
      setLoggedIn(true);
      setTimeout(fetchNotes, 0); // fetch notes after login
    }} />;
  }

  return (
    <>
      <div className="notes-container">
        <div className="notes-header">
          <h2>My Notes</h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="create-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Note'}
            </button>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }} style={{
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: 8,
              boxShadow: '0 2px 8px rgba(231,76,60,0.08)',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}>Logout</button>
          </div>
        </div>
        {showForm && (
          <NoteForm
            title={title}
            content={content}
            onTitleChange={e => setTitle(e.target.value)}
            onContentChange={e => setContent(e.target.value)}
            onSubmit={handleAddNote}
            onCancel={() => { setShowForm(false); setTitle(''); setContent(''); }}
            loading={adding}
            submitLabel="Add"
            cancelLabel="Cancel"
          />
        )}
        {loading ? (
          <div className="notes-loading">Loading...</div>
        ) : error ? (
          <div className="notes-error">{error}</div>
        ) : (
          <div className="notes-list">
            {notes.length === 0 ? (
              <div className="notes-empty">No notes yet.</div>
            ) : (
              notes.map(note => {
                const expanded = expandedId === note._id;
                const editing = editId === note._id;
                return (
                  <NoteCard
                    key={note._id}
                    note={note}
                    expanded={expanded}
                    editing={editing}
                    onExpand={handleExpand}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  >
                    {editing && (
                      <NoteForm
                        title={editTitle}
                        content={editContent}
                        onTitleChange={e => setEditTitle(e.target.value)}
                        onContentChange={e => setEditContent(e.target.value)}
                        onSubmit={e => { e.preventDefault(); handleEditSave(note._id); }}
                        onCancel={() => { setEditId(null); setExpandedId(null); }}
                        loading={false}
                        submitLabel="Save"
                        cancelLabel="Cancel"
                      />
                    )}
                  </NoteCard>
                );
              })
            )}
          </div>
        )}
      </div>
      <span
        style={{
          position: 'fixed',
          right: 20,
          bottom: 16,
          zIndex: 9999,
          fontSize: '1.05rem',
          color: '#444',
          opacity: 0.85,
          fontFamily: 'Segoe UI, Roboto, Arial, sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 1px 4px rgba(255,255,255,0.7), 0 0px 2px rgba(0,0,0,0.12)'
        }}
      >© AdarshNotes</span>
    </>
  );
}

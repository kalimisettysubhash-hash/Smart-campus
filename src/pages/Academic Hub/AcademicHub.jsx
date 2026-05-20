import { useState, useEffect } from "react";
import "./AcademicHub.css";

const initialNotes = [
    {
      id: 1,
      title: "My First Reflective Journal",
      description: "Today I learned how to use React components. It was fun but a bit confusing at first. I need to practice more.",
      category: "Reflective Journal",
      link: "",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      upvotes: 12,
      isTrending: false,
    },
    {
      id: 2,
      title: "Reflective Lab: Building a To-Do App",
      description: "In this lab, we built a simple to-do list. I realized how important state management is when items are added or removed.",
      category: "Reflective Labs",
      link: "",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      upvotes: 45,
      isTrending: true,
    },
    {
      id: 3,
      title: "Journal: Understanding Databases",
      description: "We talked about SQL today. Tables and rows make sense to me, but joins are still tricky. I will watch some videos on it.",
      category: "Reflective Journal",
      link: "",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      upvotes: 8,
      isTrending: false,
    },
    {
      id: 4,
      title: "Reflective Lab: Styling with CSS",
      description: "Our lab was about making things look good using CSS Flexbox. It is much easier to center things now!",
      category: "Reflective Labs",
      link: "",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      upvotes: 105,
      isTrending: true,
    },
    {
      id: 5,
      title: "Journal: Team Project Start",
      description: "Started working with my team today. We divided the work. Communication is going to be the key to our success.",
      category: "Reflective Journal",
      link: "",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      upvotes: 22,
      isTrending: false,
    }
  ];

  const categories = ["Reflective Journal", "Reflective Labs", "Web Dev", "Database", "Other"];

function Academic() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("React JS");
  const [file, setFile] = useState(null);
  
  const [previewNote, setPreviewNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedNotes = localStorage.getItem("notes");
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes(initialNotes);
      }
      setIsLoading(false);
    };
    
    fetchNotes();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("notes", JSON.stringify(notes));
    }
  }, [notes, isLoading]);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleSelect = (e) => setFilter(e.target.value);
  const handleModal = () => setShowModal(!showModal);

  const handleAddNote = (e) => {
    e.preventDefault();
    const newNote = {
      id: Date.now(),
      title,
      description,
      category,
      link,
      file,
      upvotes: 0,
      isTrending: false,
    }
    setNotes([newNote, ...notes]);
    setShowModal(false);
    setTitle("");
    setDescription("");
    setLink("");
    setCategory("Reflective Journal");
    setFile(null);
  };

  const toggleBookmark = (e, id) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const handleUpvote = (e, id) => {
    e.stopPropagation();
    setNotes(notes.map(note => {
      if (note.id === id) {
        const newUpvotes = note.upvotes + 1;
        return { ...note, upvotes: newUpvotes, isTrending: newUpvotes >= 100 };
      }
      return note;
    }));
  };

  const handleShare = (e, note) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: note.description,
        url: note.link || window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(note.link || window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownload = (e, note) => {
    e.stopPropagation();
    if (note.file) {
      const url = URL.createObjectURL(note.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = note.file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (note.pdfUrl) {
      window.open(note.pdfUrl, '_blank');
    } else {
      alert("No PDF available for download.");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchSearch = note.title.toLowerCase().includes(search.toLowerCase());
    
    let matchSubject;
    if (filter === "All") matchSubject = true;
    else if (filter === "My Saved Notes") matchSubject = bookmarkedIds.includes(note.id);
    else matchSubject = note.category === filter;
    
    return matchSearch && matchSubject;
  });

  return (
    <div className="academic-container">
      <div className="academic-header">
        <div>
          <h1 className="academic-title">Academic Hub</h1>
          <p className="academic-subtitle">Access and share your reflective journals and lab notes.</p>
        </div>

        <div className="header-actions">
          <button 
            className="add-note-btn"
            onClick={handleModal}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
            Add Note
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-input-wrapper">
          <div className="search-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search journals and notes..."
            className="search-input input-field"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <select
          className="category-select input-field"
          value={filter}
          onChange={handleSelect}
        >
          <option>All</option>
          <option>My Saved Notes</option>
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="notes-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="skeleton-card skeleton-pulse"></div>
          ))
        ) : filteredNotes.length === 0 ? (
          <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--text-muted)"}}>
            No notes found matching your criteria.
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div 
              key={note.id} 
              className="note-card"
              onClick={() => setPreviewNote(note)}
            >
              {note.isTrending && <div className="trending-badge"></div>}
              
              <div className="note-header">
                <div className="note-badges">
                  <span className="note-category">
                    {note.category}
                  </span>
                  {note.isTrending && (
                    <span title="Trending Note" style={{display: 'flex', alignItems: 'center'}}>
                      <svg className="fire-icon" width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                    </span>
                  )}
                </div>
                
                <div className="note-actions">
                  <button 
                    onClick={(e) => handleUpvote(e, note.id)}
                    className="icon-btn"
                    title="Upvote"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                    {note.upvotes}
                  </button>
                  <button 
                    onClick={(e) => toggleBookmark(e, note.id)}
                    className={`icon-btn ${bookmarkedIds.includes(note.id) ? 'active-bookmark' : ''}`}
                    title="Bookmark"
                  >
                    {bookmarkedIds.includes(note.id) ? (
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    )}
                  </button>
                  <button 
                    onClick={(e) => handleShare(e, note)}
                    className="icon-btn"
                    title="Share"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  </button>
                </div>
              </div>
              <h2 className="note-title">{note.title}</h2>
              <p className="note-description">{note.description}</p>
              
              <div className="note-footer">
                <span className="preview-btn">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  Preview Details
                </span>
                
                {(note.file || note.pdfUrl) && (
                   <button 
                     onClick={(e) => handleDownload(e, note)}
                     className="download-btn"
                     title="Download PDF"
                   >
                     <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                   </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {showModal && (
        <div className="modal-overlay" onClick={handleModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Upload Official Note</h2>
              <button onClick={handleModal} className="modal-close-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form id="add-note-form" onSubmit={handleAddNote}>
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="input-field"
                    placeholder="Enter note title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="input-field"
                    placeholder="Enter note description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="link">Reference Link (Optional)</label>
                  <input
                    type="url"
                    id="link"
                    className="input-field"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="input-field"
                    style={{padding: "0.4rem 1rem"}}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="category">Category</label>
                  <select
                    id="category"
                    className="input-field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map(cat => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
                <button type="button" onClick={handleModal} className="btn-cancel">Cancel</button>
                <button type="submit" form="add-note-form" className="btn-save">Save Note</button>
            </div>
          </div>
        </div>
      )}

      {previewNote && (
        <div className="modal-overlay" onClick={() => setPreviewNote(null)}>
          <div className="modal-content large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <span className="note-category">{previewNote.category}</span>
                <h2 className="modal-title">{previewNote.title}</h2>
              </div>
              <button onClick={() => setPreviewNote(null)} className="modal-close-btn">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body" style={{fontSize: "1rem"}}>
              <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
                 <span style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600}}>
                   <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
                   {previewNote.upvotes} Upvotes
                 </span>
                 {previewNote.isTrending && (
                   <span style={{color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600}}>
                     <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                     Trending
                   </span>
                 )}
              </div>
            
              <h3 style={{fontWeight: 700, marginBottom: "0.5rem"}}>Description</h3>
              <p style={{color: "var(--text-muted)", whiteSpace: "pre-wrap", lineHeight: 1.6}}>{previewNote.description}</p>
              
              {previewNote.link && (
                 <div className="preview-link-container">
                    <h3 style={{fontWeight: 700, marginBottom: "0.5rem"}}>Reference Link</h3>
                    <a href={previewNote.link} target="_blank" rel="noopener noreferrer" className="preview-link">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      {previewNote.link}
                    </a>
                 </div>
              )}
            </div>
            <div className="modal-footer">
                <button onClick={(e) => handleShare(e, previewNote)} className="btn-cancel" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                  Share
                </button>
                <button 
                  onClick={(e) => { toggleBookmark(e, previewNote.id); setPreviewNote({...previewNote}); }} 
                  className={`btn-cancel ${bookmarkedIds.includes(previewNote.id) ? 'active-bookmark' : ''}`} 
                  style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                >
                  {bookmarkedIds.includes(previewNote.id) ? (
                    <>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      Save Note
                    </>
                  )}
                </button>
                {(previewNote.file || previewNote.pdfUrl) && (
                   <button 
                     onClick={(e) => handleDownload(e, previewNote)}
                     className="btn-save"
                     style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                   >
                     <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                     Download PDF
                   </button>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Academic;

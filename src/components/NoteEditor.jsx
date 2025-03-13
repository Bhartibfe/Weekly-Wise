import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Save, BookOpen, X, Sparkles } from 'lucide-react';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    id: id,
    title: '',
    content: '',
    tags: [],
    createdBy: 'User',
    lastEdited: new Date().toLocaleString()
  });
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const dropdownRef = useRef(null);
  const originalNote = useRef(null);

  // Available tags with their colors
  const availableTags = [
    { name: 'Product', color: 'bg-amber-100 text-amber-800' },
    { name: 'UX', color: 'bg-gray-200 text-gray-800' },
    { name: 'Research', color: 'bg-purple-100 text-purple-800' },
    { name: 'Marketing', color: 'bg-orange-100 text-orange-800' },
    { name: 'Important', color: 'bg-red-100 text-red-800' }
  ];

  // Click outside handler to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsTagDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch note data from localStorage when the component mounts
  useEffect(() => {
    const fetchNoteData = () => {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        const foundNote = parsedNotes.find(n => n.id.toString() === id.toString());
        if (foundNote) {
          setNote(foundNote);
          originalNote.current = JSON.parse(JSON.stringify(foundNote)); // Deep copy for comparison
          return;
        }
      }
      
      // If note not found, create a new one with the given ID
      const newNote = {
        id: parseInt(id) || id, // Keep the ID as is (could be a number or string)
        title: 'Untitled',
        content: '',
        tags: [],
        createdBy: 'User',
        lastEdited: new Date().toLocaleString()
      };
      
      setNote(newNote);
      originalNote.current = JSON.parse(JSON.stringify(newNote)); // Deep copy for comparison
      
      // For new notes, we need to save them initially so they appear in the list
      const existingNotes = savedNotes ? JSON.parse(savedNotes) : [];
      localStorage.setItem('notes', JSON.stringify([...existingNotes, newNote]));
    };
    
    fetchNoteData();
  }, [id]);

  // Check for unsaved changes whenever note state changes
  useEffect(() => {
    if (!originalNote.current) return;
    
    const isChanged = 
      note.title !== originalNote.current.title ||
      note.content !== originalNote.current.content ||
      JSON.stringify(note.tags) !== JSON.stringify(originalNote.current.tags);
    
    setHasUnsavedChanges(isChanged);
  }, [note]);

  const handleTitleChange = (e) => {
    setNote({ ...note, title: e.target.value });
  };

  const handleContentChange = (e) => {
    setNote({ ...note, content: e.target.value });
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Update lastEdited timestamp
    const updatedNote = { 
      ...note, 
      lastEdited: new Date().toLocaleString() 
    };
    
    try {
      // Get existing notes
      const savedNotes = localStorage.getItem('notes');
      let notes = savedNotes ? JSON.parse(savedNotes) : [];
      
      // Update or add the current note
      const noteIndex = notes.findIndex(n => n.id.toString() === updatedNote.id.toString());
      if (noteIndex >= 0) {
        notes[noteIndex] = updatedNote;
      } else {
        notes.push(updatedNote);
      }
      
      // Save back to localStorage
      localStorage.setItem('notes', JSON.stringify(notes));
      
      // Trigger a storage event for other tabs to detect the change
      window.dispatchEvent(new Event('storage'));
      
      // Update state
      setNote(updatedNote);
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      originalNote.current = JSON.parse(JSON.stringify(updatedNote)); // Update original reference
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving note:", error);
      // Handle save error
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmExit = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmExit) return;
    }
    navigate('/notes');
  };

  const getTagColor = (tag) => {
    const tagItem = availableTags.find(t => t.name === tag);
    return tagItem ? tagItem.color : 'bg-blue-100 text-blue-800';
  };

  const toggleTagDropdown = () => {
    setIsTagDropdownOpen(!isTagDropdownOpen);
  };

  const addTag = (tagName) => {
    if (!note.tags.includes(tagName)) {
      const updatedNote = { 
        ...note, 
        tags: [...note.tags, tagName]
      };
      setNote(updatedNote);
    }
    setIsTagDropdownOpen(false);
  };

  const removeTag = (tagName) => {
    const updatedNote = { 
      ...note, 
      tags: note.tags.filter(tag => tag !== tagName)
    };
    setNote(updatedNote);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 hover:bg-purple-100 rounded-full transition-colors duration-200"
              onClick={handleBack}
            >
              <ArrowLeft size={18} className="text-purple-500" />
            </button>
            <BookOpen className="text-purple-500" size={24} />
            <span className="text-gray-700 font-medium">Notes & drafts</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 flex items-center">
              {saveSuccess && (
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full flex items-center">
                  <Sparkles size={14} className="mr-1" />
                  Saved!
                </span>
              )}
              {hasUnsavedChanges && (
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full mr-2">Unsaved changes</span>
              )}
              <span className="hidden md:inline">Last edited {note.lastEdited}</span>
            </div>
            <button 
              className={`${
                isSaving ? 'bg-purple-400' : 
                hasUnsavedChanges ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 
                'bg-purple-300'
              } text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-all duration-300 ${
                hasUnsavedChanges ? 'hover:shadow-md' : ''
              }`}
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
            >
              <Save size={16} />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
          <input
            type="text"
            className="text-3xl font-bold mb-4 w-full border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 placeholder-gray-400"
            value={note.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
          />
          
          <div className="mb-6 flex flex-wrap gap-2">
            {note.tags && note.tags.map((tag) => (
              <span 
                key={tag} 
                className={`px-3 py-1 text-sm rounded-full ${getTagColor(tag)} flex items-center`}
              >
                {tag}
                <button 
                  className="ml-1 hover:text-gray-900" 
                  onClick={() => removeTag(tag)}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            
            <div className="relative" ref={dropdownRef}>
              <button 
                className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-1 transition-colors"
                onClick={toggleTagDropdown}
              >
                <Tag size={14} />
                <span>Add tag</span>
              </button>
              
              {isTagDropdownOpen && (
                <div className="absolute z-10 mt-1 w-64 bg-white/90 backdrop-blur-md shadow-xl rounded-lg p-3 border border-purple-100">
                  <div className="mb-2">
                    <input 
                      type="text" 
                      className="w-full p-2 bg-purple-50 text-gray-800 rounded-lg border border-purple-100 focus:outline-none focus:ring-1 focus:ring-purple-500" 
                      placeholder="Search for an option..."
                    />
                  </div>
                  <div className="text-purple-600 text-sm mb-1 px-2 font-medium">Select an option or create one</div>
                  <div className="max-h-64 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <div 
                        key={tag.name} 
                        className="flex items-center p-2 hover:bg-purple-50 cursor-pointer rounded-lg transition-colors"
                        onClick={() => addTag(tag.name)}
                      >
                        <div className="flex-shrink-0 mr-2 text-purple-400">∷</div>
                        <div className={`px-2 py-0.5 rounded text-sm ${tag.color}`}>
                          {tag.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <textarea
            className="w-full min-h-[60vh] border-none focus:outline-none focus:ring-0 text-gray-800 resize-none bg-transparent rounded-lg placeholder-gray-400"
            value={note.content}
            onChange={handleContentChange}
            placeholder="Start writing here..."
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
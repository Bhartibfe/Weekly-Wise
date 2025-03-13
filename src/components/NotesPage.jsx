import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Tag, X, Trash2, Plus, Book, Filter } from 'lucide-react';

const NotesPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [activeView, setActiveView] = useState('all');
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  // Replace single state with a map of note ID to dropdown state
  const [tagDropdownStates, setTagDropdownStates] = useState({});
  const [newTagInput, setNewTagInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [selectedGroupTags, setSelectedGroupTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([
    { name: 'UX', color: 'bg-gray-200 text-gray-800' },
    { name: 'Marketing', color: 'bg-orange-100 text-orange-800' },
    { name: 'Important', color: 'bg-red-100 text-red-800' }
  ]);
  
  // Create a map to store refs for each dropdown
  const dropdownRefs = useRef({});
  const titleInputRef = useRef(null);
  const tagInputRef = useRef(null);

  // Load notes from localStorage when the component mounts
  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes).map(note => ({
            ...note,
            tags: Array.isArray(note.tags) ? note.tags : []
          }));
          
          setNotes(parsedNotes);
          updateAvailableTagsFromNotes(parsedNotes);
        } catch (error) {
          console.error('Error parsing notes from localStorage:', error);
          initializeDefaultNotes();
        }
      } else {
        initializeDefaultNotes();
      }
    };
    
    const initializeDefaultNotes = () => {};
    
    loadNotes();
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to update available tags from notes
  const updateAvailableTagsFromNotes = (notesArray) => {
    const uniqueTags = new Set();
    
    notesArray.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => uniqueTags.add(tag));
      }
    });
    
    setAvailableTags(prevTags => {
      const existingTagNames = new Set(prevTags.map(tag => tag.name));
      
      const newTags = Array.from(uniqueTags)
        .filter(tagName => !existingTagNames.has(tagName))
        .map(tagName => ({
          name: tagName,
          color: getRandomTagColor()
        }));
      
      return [...prevTags, ...newTags];
    });
  };

  // Generate a random color for new tags
  const getRandomTagColor = () => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
      'bg-pink-100 text-pink-800',
      'bg-teal-100 text-teal-800'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle localStorage changes (for multi-tab support)
  const handleStorageChange = (event) => {
    if (event.key === 'notes' && event.newValue) {
      try {
        const updatedNotes = JSON.parse(event.newValue).map(note => ({
          ...note,
          tags: Array.isArray(note.tags) ? note.tags : []
        }));
        
        setNotes(updatedNotes);
        updateAvailableTagsFromNotes(updatedNotes);
      } catch (error) {
        console.error('Error parsing notes from storage event:', error);
      }
    }
  };

  // Click outside handlers for dropdowns - modified to handle multiple dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if click was outside any of the dropdowns
      const dropdownsArray = Object.entries(dropdownRefs.current);
      
      for (const [noteId, dropdownRef] of dropdownsArray) {
        if (
          // If dropdown is open and click is outside dropdown
          tagDropdownStates[noteId] && 
          dropdownRef && 
          !dropdownRef.contains(event.target)
        ) {
          // Close this specific dropdown
          setTagDropdownStates(prev => ({
            ...prev,
            [noteId]: false
          }));
          setNewTagInput('');
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tagDropdownStates]);

  // Focus input when editing title
  useEffect(() => {
    if (editingTitleId && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTitleId]);

  // Focus the tag input when any dropdown opens
  useEffect(() => {
    // Find any open dropdown
    const openNoteId = Object.entries(tagDropdownStates).find(([, isOpen]) => isOpen)?.[0];
    
    if (openNoteId) {
      // Position the dropdown
      positionTagDropdown(openNoteId);
      
      // Add resize listener
      const handleResize = () => positionTagDropdown(openNoteId);
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [tagDropdownStates]);

  const handleNewNote = () => {
    const newId = Date.now();
    const newNote = {
      id: newId,
      title: 'Untitled',
      content: '',
      tags: [],
      createdBy: 'User',
      lastEdited: new Date().toLocaleString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    
    navigate(`/notes/${newId}`);
  };

  const handleNoteClick = (id) => {
    if (editingTitleId !== null) return;
    navigate(`/notes/${id}`);
  };

  const getTagColor = (tag) => {
    const tagItem = availableTags.find(t => t.name === tag);
    return tagItem ? tagItem.color : 'bg-blue-100 text-blue-800';
  };

  const handleEditTitle = (id, currentTitle) => {
    setEditingTitleId(id);
    setEditTitle(currentTitle);
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
  };

  const saveTitle = () => {
    if (editingTitleId) {
      const updatedNotes = notes.map(note => 
        note.id === editingTitleId ? 
        { 
          ...note, 
          title: editTitle,
          lastEdited: new Date().toLocaleString()
        } : note
      );
      
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      
      setEditingTitleId(null);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveTitle();
    } else if (e.key === 'Escape') {
      setEditingTitleId(null);
    }
  };
  // Add this function to determine dropdown position
const positionTagDropdown = (noteId) => {
  // Delay to ensure DOM is updated
  setTimeout(() => {
    if (dropdownRefs.current[noteId]) {
      const buttonRect = dropdownRefs.current[noteId].getBoundingClientRect();
      const dropdownEl = dropdownRefs.current[noteId].querySelector('div.absolute');
      
      if (dropdownEl) {
        // Get viewport height and dropdown height
        const viewportHeight = window.innerHeight;
        const dropdownHeight = dropdownEl.offsetHeight;
        
        // Check if there's enough space below
        const spaceBelow = viewportHeight - buttonRect.bottom;
        
        if (spaceBelow < dropdownHeight + 20) {
          // Not enough space below, position above
          dropdownEl.style.bottom = '100%';
          dropdownEl.style.top = 'auto';
          dropdownEl.style.marginBottom = '4px';
          dropdownEl.style.marginTop = '0';
        } else {
          // Enough space below, position below (default)
          dropdownEl.style.top = '100%';
          dropdownEl.style.bottom = 'auto';
          dropdownEl.style.marginTop = '4px';
          dropdownEl.style.marginBottom = '0';
        }
      }
    }
  }, 10);
};

  // Modified to handle multiple dropdowns independently
  const toggleTagDropdown = (e, noteId) => {
    e.stopPropagation();
    
    setTagDropdownStates(prev => {
      // Close all other dropdowns
      const newState = Object.keys(prev).reduce((acc, id) => {
        acc[id] = false;
        return acc;
      }, {});
      
      // Toggle the current dropdown
      newState[noteId] = !prev[noteId];
      return newState;
    });
    
    setNewTagInput('');
    
    // If opening the dropdown, position it
    if (!tagDropdownStates[noteId]) {
      positionTagDropdown(noteId);
    }
  };

  const handleNewTagInputChange = (e) => {
    setNewTagInput(e.target.value);
  };

  // Create a new tag - modified to work with multiple dropdowns
  const createNewTag = (e, noteId) => {
    if (e) e.preventDefault();
    
    // If no explicit noteId was provided, find the first open dropdown
    if (!noteId) {
      noteId = Object.entries(tagDropdownStates).find(([, isOpen]) => isOpen)?.[0];
    }
    
    if (newTagInput.trim() === '' || !noteId) return;
    
    const newTagName = newTagInput.trim();
    
    // Check if tag already exists (case insensitive)
    const existingTagIndex = availableTags.findIndex(tag => 
      tag.name.toLowerCase() === newTagName.toLowerCase()
    );
    
    if (existingTagIndex >= 0) {
      // Use existing tag
      addTag(noteId, availableTags[existingTagIndex].name);
    } else {
      // Create new tag
      const newTag = {
        name: newTagName,
        color: getRandomTagColor()
      };
      
      // Add to available tags
      setAvailableTags(prev => [...prev, newTag]);
      
      // Add tag to current note
      addTag(noteId, newTag.name);
    }
    
    setNewTagInput('');
  };

  // Add a tag to a note
  const addTag = (noteId, tagName) => {
    if (!noteId) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        // Ensure tags is an array
        const currentTags = Array.isArray(note.tags) ? [...note.tags] : [];
        
        // Only add if tag doesn't already exist (case sensitive)
        if (!currentTags.includes(tagName)) {
          return {
            ...note,
            tags: [...currentTags, tagName],
            lastEdited: new Date().toLocaleString()
          };
        }
      }
      return note;
    });
    
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    
    // Close the dropdown after adding a tag
    setTagDropdownStates(prev => ({
      ...prev,
      [noteId]: false
    }));
  };

  // Remove a tag from a note
  const removeTag = (e, noteId, tagName) => {
    e.stopPropagation();
    
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        const currentTags = Array.isArray(note.tags) ? [...note.tags] : [];
        
        return {
          ...note,
          tags: currentTags.filter(tag => tag !== tagName),
          lastEdited: new Date().toLocaleString()
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };
  
  // Get all unique tags from notes
  const getAllUniqueTags = () => {
    const tagSet = new Set();
    notes.forEach(note => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet);
  };
  
  // Toggle tag selection for grouped view
  const toggleTagSelect = (tag) => {
    setSelectedGroupTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  // Handle search term change
  const handleSearch = (value) => {
    setSearchTerm(value);
  };
  
  // Handle delete note button click
  const handleDeleteClick = (e, note) => {
    e.stopPropagation();
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };
  
  // Confirm delete note
  const confirmDelete = () => {
    if (noteToDelete) {
      const updatedNotes = notes.filter(note => note.id !== noteToDelete.id);
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };
  
  // Filter notes based on the active view and search
  const getFilteredNotes = () => {
    let filtered = [...notes];
    
    // Filter by view
    if (activeView === 'important') {
      filtered = filtered.filter(note => 
        Array.isArray(note.tags) && note.tags.includes('Important')
      );
    } else if (activeView === 'grouped' && selectedGroupTags.length > 0) {
      filtered = filtered.filter(note => 
        Array.isArray(note.tags) && 
        selectedGroupTags.some(tag => note.tags.includes(tag))
      );
    }
    
    // Filter by search
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(search) || 
        (note.content && note.content.toLowerCase().includes(search)) ||
        (Array.isArray(note.tags) && note.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }
    
    return filtered;
  };

  const uniqueTags = getAllUniqueTags();
  const filteredNotes = getFilteredNotes();

  return (
    <div className="p-8  bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md">
              <FileText className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Notes & Drafts
            </h1>
          </div>
          <p className="text-gray-600 ml-1">Capture your ideas, organize with tags, and access them anywhere.</p>
        </div>

        {/* Control Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* View Tabs */}
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 flex items-center space-x-2 rounded-lg transition-all duration-200 ${
                  activeView === 'all' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveView('all');
                  setSelectedGroupTags([]);
                }}
              >
                <FileText size={16} />
                <span>All notes</span>
              </button>
              <button 
                className={`px-4 py-2 flex items-center space-x-2 rounded-lg transition-all duration-200 ${
                  activeView === 'important' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveView('important');
                  setSelectedGroupTags([]);
                }}
              >
                <Tag size={16} />
                <span>Important notes</span>
              </button>
              <button 
                className={`px-4 py-2 flex items-center space-x-2 rounded-lg transition-all duration-200 ${
                  activeView === 'grouped' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => {
                  setActiveView('grouped');
                  setSelectedGroupTags([]);
                }}
              >
                <Filter size={16} />
                <span>Grouped by tag</span>
              </button>
            </div>
            
            {/* Search and New Button */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" 
                />
              </div>
              <button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                onClick={handleNewNote}
              >
                <Plus size={18} />
                <span>New Note</span>
              </button>
            </div>
          </div>

          {/* Tag selection for grouped view */}
          {activeView === 'grouped' && (
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-gray-600 mr-2">Select tags:</span>
                {uniqueTags.map((tag) => (
                  <button
                    key={tag}
                    className={`px-3 py-1 rounded-full transition-all duration-200 ${
                      selectedGroupTags.includes(tag) 
                        ? 'ring-2 ring-purple-500 shadow-sm' 
                        : 'hover:shadow-sm'
                    } ${getTagColor(tag)}`}
                    onClick={() => toggleTagSelect(tag)}
                  >
                    {tag}
                  </button>
                ))}
                {uniqueTags.length === 0 && (
                  <span className="text-gray-500 italic">No tags available</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notes Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-purple-100 shadow-sm ">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-purple-100">
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-purple-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-purple-700">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-purple-700">
                  Last Edited
                </th>
                <th className="px-6 py-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="relative divide-y divide-purple-50">
              {filteredNotes.map((note) => (
                <tr 
                  key={note.id} 
                  className="hover:bg-purple-50/50 cursor-pointer transition-colors duration-150"
                  onClick={() => handleNoteClick(note.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                    <div className="p-2 mr-3 bg-purple-100 rounded-lg">
                      <FileText size={16} className="text-purple-500" />
                    </div>
                    {editingTitleId === note.id ? (
                      <input
                        ref={titleInputRef}
                        type="text"
                        className="border border-purple-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={editTitle}
                        onChange={handleTitleChange}
                        onBlur={saveTitle}
                        onKeyDown={handleTitleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span 
                        className="hover:text-purple-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTitle(note.id, note.title);
                        }}
                      >
                        {note.title}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-1 items-center">
                      {Array.isArray(note.tags) && note.tags.map((tag) => (
                        <div 
                          key={`${note.id}-${tag}`} 
                          className={`px-2 py-1 mb-1 text-xs rounded-full ${getTagColor(tag)} flex items-center transition-all hover:shadow-sm`}
                        >
                          <span>{tag}</span>
                          <button 
                            className="ml-1 hover:text-gray-900" 
                            onClick={(e) => removeTag(e, note.id, tag)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      <div 
                        className="relative" 
                        ref={(el) => dropdownRefs.current[note.id] = el}
                      >
                        <button 
                          className="px-2 py-1 text-xs rounded-full bg-purple-100 hover:bg-purple-200 flex items-center gap-1 transition-colors"
                          onClick={(e) => toggleTagDropdown(e, note.id)}
                        >
                          <Tag size={12} className="text-purple-600" />
                          <span className="text-purple-700">Add</span>
                        </button>
                        
                        {tagDropdownStates[note.id] && (
                          <div className="absolute left-0 mt-1 w-auto min-w-[200px] max-w-[300px] bg-white border border-purple-100 shadow-lg rounded-lg p-2 z-50">
                            <form onSubmit={(e) => createNewTag(e, note.id)}>
                              <div className="mb-2">
                                <input 
                                  ref={tagInputRef}
                                  type="text" 
                                  className="w-full p-2 bg-white text-gray-800 rounded-lg border border-purple-200 focus:outline-none focus:ring-1 focus:ring-purple-500" 
                                  placeholder="Search or create a new tag..."
                                  value={newTagInput}
                                  onChange={handleNewTagInputChange}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </form>
                            <div className="text-gray-600 text-sm mb-2 px-2">
                              {newTagInput.trim() !== '' ? (
                                <div className="flex justify-between items-center">
                                  <span>Create new tag: &quot;{newTagInput}&quot;</span>
                                  <button 
                                    className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs"
                                    onClick={(e) => createNewTag(e, note.id)}
                                  >
                                    Create
                                  </button>
                                </div>
                              ) : (
                                <span>Select an option or create one</span>
                              )}
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                              {availableTags
                                .filter(tag => 
                                  !newTagInput || tag.name.toLowerCase().includes(newTagInput.toLowerCase())
                                )
                                .filter(tag => !Array.isArray(note.tags) || !note.tags.includes(tag.name))
                                .map((tag) => (
                                  <div 
                                    key={tag.name} 
                                    className="flex items-center p-2 hover:bg-purple-50 cursor-pointer rounded-lg transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addTag(note.id, tag.name);
                                    }}
                                  >
                                    <div className="flex-shrink-0 mr-2 text-purple-400">∷</div>
                                    <div className={`px-2 py-0.5 rounded-full text-sm ${tag.color}`}>
                                      {tag.name}
                                    </div>
                                  </div>
                                ))}
                              {availableTags
                                .filter(tag => 
                                  !newTagInput || tag.name.toLowerCase().includes(newTagInput.toLowerCase())
                                )
                                .filter(tag => !Array.isArray(note.tags) || !note.tags.includes(tag.name))
                                .length === 0 && newTagInput.trim() === '' && (
                                <div className="p-2 text-gray-400 text-sm">
                                  No more tags available
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                 
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {note.lastEdited}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end">
                      <button 
                        className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors"
                        onClick={(e) => handleDeleteClick(e, note)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNotes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <Book size={48} className="text-purple-300 mb-4" />
                      {activeView === 'grouped' && selectedGroupTags.length > 0 
                        ? <p className="text-lg">No notes with the selected tags</p>
                        : activeView === 'grouped'
                          ? <p className="text-lg">Select at least one tag to view notes</p>
                          : searchTerm.trim() !== ''
                            ? <p className="text-lg">No notes match your search</p>
                            : <p className="text-lg">No notes found. Create your first note!</p>
                      }
                      {(activeView !== 'grouped' || selectedGroupTags.length === 0) && searchTerm.trim() === '' && (
                        <button 
                          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
                          onClick={handleNewNote}
                        >
                          <span className="flex items-center gap-2">
                            <Plus size={16} />
                            New Note
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-3 border-t border-purple-100 text-sm text-gray-500 bg-purple-50/50">
            <div className="flex items-center">
              <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full mr-2">
                {filteredNotes.length}
              </span>
              <span>notes found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-purple-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Delete Note</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{noteToDelete?.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false);
                  setNoteToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Search, X, ExternalLink, Grid, List, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LinksPage = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLink, setNewLink] = useState({ title: '', url: '', category: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddButtonHovered, setIsAddButtonHovered] = useState(false);

  // Load links and settings from localStorage on component mount
  useEffect(() => {
    const savedLinks = localStorage.getItem('links');
    const savedViewMode = localStorage.getItem('viewMode');
    
    if (savedLinks) {
      const parsedLinks = JSON.parse(savedLinks);
      setLinks(parsedLinks);
      
      // Extract unique categories
      const uniqueCategories = ['All', ...new Set(parsedLinks
        .map(link => link.category)
        .filter(Boolean))];
      setCategories(uniqueCategories);
    }
    
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save links to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('links', JSON.stringify(links));
    
    // Extract unique categories
    const uniqueCategories = ['All', ...new Set(links
      .map(link => link.category)
      .filter(Boolean))];
    setCategories(uniqueCategories);
  }, [links]);

  // Save view mode setting
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  const handleAddLink = () => {
    // Ensure URL has protocol
    let url = newLink.url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (editIndex !== null) {
      // Update existing link
      const updatedLinks = [...links];
      updatedLinks[editIndex] = { 
        ...newLink, 
        url: url,
        favicon: `https://www.google.com/s2/favicons?domain=${url}&sz=64`,
        addedDate: updatedLinks[editIndex].addedDate
      };
      setLinks(updatedLinks);
      setEditIndex(null);
    } else {
      // Add new link
      setLinks([
        ...links, 
        { 
          ...newLink, 
          url: url,
          favicon: `https://www.google.com/s2/favicons?domain=${url}&sz=64`,
          addedDate: new Date().toISOString()
        }
      ]);
    }
    
    // Reset and close modal
    setNewLink({ title: '', url: '', category: '' });
    setShowAddModal(false);
  };

  const handleEditLink = (index) => {
    setEditIndex(index);
    setNewLink(links[index]);
    setShowAddModal(true);
  };

  const handleRemoveLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    setLinks(updatedLinks);
  };

  const handleLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const extractDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Filter links based on search term and selected category
  const filteredLinks = links.filter(link => {
    const matchesSearch = 
      (link.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (extractDomain(link.url).toLowerCase()).includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      link.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate a gradient color based on domain name
  const generateGradient = (url) => {
    try {
      const domain = new URL(url).hostname;
      // Simple hash function to generate colors
      let hash = 0;
      for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const h1 = Math.abs(hash % 360);
      const h2 = (h1 + 40) % 360;
      
      return `linear-gradient(135deg, hsl(${h1}, 80%, 60%), hsl(${h2}, 80%, 50%))`;
    } catch {
      return 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    }
  };

  const getInitial = (link) => {
    if (link.title) return link.title.charAt(0).toUpperCase();
    try {
      return new URL(link.url).hostname.charAt(0).toUpperCase();
    } catch {
      return '?';
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header with Link Icon instead of Back Button */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="mr-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-300"
                aria-label="Back to home"
              >
                <Link size={24} className="text-purple-500" />
              </button>
              <div>
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                  Links 
                </h1>
                <p className="text-gray-600 mt-1">
                  Save and organize your favorite websites in one place.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">              
              <div className="flex border rounded-lg overflow-hidden shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white text-gray-500 hover:bg-purple-50 hover:text-purple-500'} transition-colors`}
                  aria-label="Grid view"
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                    : 'bg-white text-gray-500 hover:bg-purple-50 hover:text-purple-500'} transition-colors`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setEditIndex(null);
                  setNewLink({ title: '', url: '', category: '' });
                  setShowAddModal(true);
                }}
                onMouseEnter={() => setIsAddButtonHovered(true)}
                onMouseLeave={() => setIsAddButtonHovered(false)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Plus 
                  size={18} 
                  className={`mr-2 transition-transform duration-300 ${isAddButtonHovered ? 'rotate-90' : ''}`} 
                />
                Add Link
              </button>
            </div>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow text-gray-800">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 bg-white/80 backdrop-blur-sm border-gray-300 placeholder-gray-400 border shadow-sm transition-all duration-300 focus:shadow-md"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {categories.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
                    } border-gray-200 border shadow-sm transform hover:scale-105`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredLinks.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-purple-100">
            <div className="w-24 h-24 mb-4 opacity-40 text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">No links found</h3>
            <p className="text-center text-gray-500 mb-6">
              {links.length > 0 
                ? "Try adjusting your search or category filter" 
                : "Add your first link to get started"}
            </p>
            <button 
              onClick={() => {
                setEditIndex(null);
                setNewLink({ title: '', url: '', category: '' });
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Plus size={18} className="mr-2" />
              Add Link
            </button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredLinks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredLinks.map((link) => {
              const originalIndex = links.findIndex(b => 
                b.url === link.url && b.title === link.title);
              
              return (
                <div key={originalIndex} className="relative group">
                  <div 
                    className="rounded-xl border p-4 h-32 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-lg bg-white/80 backdrop-blur-sm border-purple-100 hover:bg-white group-hover:scale-105 transform"
                    onClick={() => handleLinkClick(link.url)}
                  >
                    <div className="w-12 h-12 mb-3 rounded-full flex items-center justify-center overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300">
                      <img 
                        src={link.favicon} 
                        alt={link.title || extractDomain(link.url)}
                        className="max-w-full max-h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full rounded-full text-white font-bold flex items-center justify-center text-lg"
                        style={{ 
                          background: generateGradient(link.url),
                          display: 'none'
                        }}
                      >
                        {getInitial(link)}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-center truncate w-full text-gray-700">
                      {link.title || extractDomain(link.url)}
                    </span>
                    {link.category && (
                      <span className="mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-500 transition-all duration-300 group-hover:bg-purple-500 group-hover:text-white">
                        {link.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 bg-gradient-to-t from-purple-900/40 to-transparent backdrop-blur-sm">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLink(originalIndex);
                        }} 
                        className="bg-white text-purple-500 hover:text-purple-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(link.url);
                        }} 
                        className="bg-white text-blue-500 hover:text-blue-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLink(originalIndex);
                        }} 
                        className="bg-white text-red-500 hover:text-red-600 p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredLinks.length > 0 && (
          <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden border border-purple-100">
            <div className="divide-y divide-purple-100">
              {filteredLinks.map((link) => {
                const originalIndex = links.findIndex(b => 
                  b.url === link.url && b.title === link.title);
                
                return (
                  <div 
                    key={originalIndex}
                    className="relative group p-4 flex items-center hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-300"
                    onClick={() => handleLinkClick(link.url)}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden mr-4 flex-shrink-0 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <img 
                        src={link.favicon} 
                        alt={link.title || extractDomain(link.url)}
                        className="max-w-full max-h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="w-full h-full rounded-full text-white font-bold flex items-center justify-center"
                        style={{ 
                          background: generateGradient(link.url),
                          display: 'none'
                        }}
                      >
                        {getInitial(link)}
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="font-medium truncate text-gray-800 group-hover:text-purple-600 transition-colors">
                        {link.title || extractDomain(link.url)}
                      </div>
                      <div className="text-sm truncate text-gray-500">
                        {extractDomain(link.url)}
                      </div>
                    </div>
                    
                    <div className="flex items-center ml-4 space-x-1">
                      {link.category && (
                        <span className="mr-4 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                          {link.category}
                        </span>
                      )}
                      
                      {link.addedDate && (
                        <span className="hidden sm:inline text-xs text-gray-400">
                          {formatDate(link.addedDate)}
                        </span>
                      )}
                      
                      <div className="flex ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLink(originalIndex);
                          }} 
                          className="p-1 rounded hover:bg-purple-100 text-purple-500 hover:text-purple-600 transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveLink(originalIndex);
                          }} 
                          className="p-1 rounded hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add/Edit Link Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-xl p-6 w-full max-w-md bg-white shadow-xl border border-purple-100 transform transition-all duration-300" 
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                {editIndex !== null ? 'Edit Link' : 'Add New Link'}
              </h2>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">Title (Optional)</label>
                <input
                  type="text"
                  value={newLink.title}
                  onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                  placeholder="Website Name"
                  className="w-full p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 border-purple-100 text-gray-900 placeholder-gray-400 border transition-all duration-300"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">URL</label>
                <input
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  placeholder="https://example.com"
                  className="w-full p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 border-purple-100 text-gray-900 placeholder-gray-400 border transition-all duration-300"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Category (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newLink.category}
                    onChange={(e) => setNewLink({...newLink, category: e.target.value})}
                    placeholder="Work, Personal, Social, etc."
                    className="w-full p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 border-purple-100 text-gray-900 placeholder-gray-400 border transition-all duration-300"
                    list="category-list"
                  />
                  <datalist id="category-list">
                    {categories.filter(cat => cat !== 'All').map(category => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg transition-all duration-300 bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLink}
                  disabled={!newLink.url}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  {editIndex !== null ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinksPage;
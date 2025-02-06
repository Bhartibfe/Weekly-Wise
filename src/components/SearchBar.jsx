import { useState } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const SearchBar = ({ onSearch, className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className={`w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
          transition-all duration-200 placeholder:text-gray-400 ${className}`}
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <Search 
        size={20} 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" 
      />
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default SearchBar;
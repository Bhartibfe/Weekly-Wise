import { useState } from 'react';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="search-container">
      <Search size={20} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={handleSearch}
      />
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired
};

export default SearchBar;
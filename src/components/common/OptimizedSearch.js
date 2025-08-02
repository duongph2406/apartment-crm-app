import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const OptimizedSearch = ({ 
  onSearch, 
  placeholder = 'Tìm kiếm...', 
  delay = 300,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  React.useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <div className={`search-box ${className}`}>
      <Search size={16} />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        autoComplete="off"
      />
      {searchTerm && (
        <button
          type="button"
          className="search-clear"
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default React.memo(OptimizedSearch);
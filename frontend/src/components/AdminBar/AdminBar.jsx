import { useState } from 'react';
import './AdminBar.css';

const AdminBar = ({ onClick, placeholder, showAddButton = true, onSearch, searchValue: externalSearchValue }) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue;
  
  const actionButtonsClass = showAddButton ? 'action-buttons' : 'action-buttons action-buttons--placeholder';

  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (externalSearchValue === undefined) {
      setInternalSearchValue(value);
    }
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <>
      <div className="action-bar">
        <div className={actionButtonsClass}>
          {showAddButton && (
            <button className="btn-add" onClick={onClick}>
              <i className="fas fa-plus"></i>
              Agregar {placeholder}
            </button>
          )}
        </div>
        
        <div className="search-section">
          <div className="search-container">
            <input 
              type="text" 
              id="searchClientes" 
              placeholder={'Buscar ' + placeholder} 
              className="search-input"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <button className="search-btn" onClick={handleSearchClick}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminBar;
import { useState } from 'react';
import './AdminBar.css';

const AdminBar = ({ onClick, placeholder, showAddButton = true, onSearch, searchValue: externalSearchValue, contadores }) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const searchValue = externalSearchValue !== undefined ? externalSearchValue : internalSearchValue;
  
  // Si hay contadores, no ocultar el contenedor aunque no haya botón de agregar
  const actionButtonsClass = (showAddButton || contadores) ? 'action-buttons' : 'action-buttons action-buttons--placeholder';

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
          {contadores && (
            <div className="search-counter">
              <span className="counter-item">
                <span className="counter-label">Clientes Activos:</span>
                <span className="counter-value counter-active">{contadores.activos}</span>
              </span>
              <span className="counter-item">
                <span className="counter-label">Clientes Inactivos:</span>
                <span className="counter-value counter-inactive">{contadores.inactivos}</span>
              </span>
            </div>
          )}
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
import { useState, useMemo } from 'react';
import './Tabla.css';

const Tabla = ({
  columns,
  data,
  loading = false,
  onVer,
  onEditar,
  onEliminar
}) => {

  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (key) => {
    let direction;
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    else {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const renderCell = (column, row) => {
    const value = row[column.key];
    if (column.render) {
      return column.render(value, row);
    }
    return value;
  };

  return (
    <div className="table-container">
      {/* Table */}
      <div className="admin-table">
        <div className="table-scroll">
          <div className="table-content">
            <table className="data-table">

              <thead className="table-head">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key}
                      className={`table-header-cell ${column.sortable ? 'sortable' : ''}`}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <span style={{display: 'inline-flex'}}>
                      {column.label}
                      {column.sortable && (
                        <svg className="sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                      </span>
                    </th>
                  ))}
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody className="table-body">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="loading-cell">
                      <div className="loading-spinner">
                        <div className="spinner"></div>
                        <span>Cargando...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedData.map((row, index) => (
                    <tr 
                      key={index} 
                      className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className={column.clickable ? 'table-cell table-link' : 'table-cell'} >
                          {renderCell(column, row)}
                        </td>
                      ))}
                      {/* Acciones */}
                      <td>
                        <div className="action-buttons-table">
                            {onVer && (
                              <button className="btn-view" onClick={() => onVer(row.id)} title="Ver detalles">
                                  <i className="fas fa-eye"></i> Ver
                              </button>
                            )}
                            {onEditar && (
                              <button className="btn-edit" onClick={() => onEditar(row.id)} title="Editar">
                                  <i className="fas fa-edit"></i> Editar
                              </button>
                            )}
                            {onEliminar && (
                              <button className="btn-delete" onClick={() => onEliminar(row.id)} title="Eliminar">
                                  <i className="fas fa-trash"></i> Eliminar
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabla;
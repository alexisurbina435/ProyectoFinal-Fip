import { useState, useMemo, useEffect } from "react";
import ContactoService from "../../services/contacto.service";
import Swal from 'sweetalert2';
import "../Tabla/Tabla.css";

const TablaBackend = ({
  columns,
  data,
  itemsPerPage = 10, // cantidad de items por pagina
  loading = false // estado de carga
}) => {

  const [consulta, setConsulta] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eliminarConsulta = async (id) => {
  Swal.fire({
    title: 'Eliminar contacto',
    text: "¿Estás seguro de eliminar el contacto?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await ContactoService.deleteContacto(id);
        Swal.fire(
          'Eliminado!',
          'El contacto ha sido eliminado.',
          'success'
        ).then(() => {
          
          window.location.reload();
        });
      } catch (error) {
        Swal.fire(
          'Error!',
          'No se pudo eliminar el contacto.',
          'error'
        );
      }
    }
  });

}

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

// Paginación
const totalPages = Math.ceil(sortedData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const paginatedData = sortedData.slice(startIndex, endIndex);

// Resetear a página 1 cuando cambian los datos
useEffect(() => {
  setCurrentPage(1);
}, [data]);

const renderCell = (column, row) => {
  const value = row[column];
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
                    key={column}
                    className={`table-header-cell ${column ? 'sortable' : ''}`}
                    style={{ width: column.width }}
                    onClick={() => column && handleSort(column)}

                  >
                    <span style={{ display: 'inline-flex' }}>

                      {column.toUpperCase()}
                      {column && (
                        <svg className="sort-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                        </svg>
                      )}
                    </span>

                  </th>

                ))}
                <th>ACCIONES</th>
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
              ) : !data.length ? (
                <tr>
                  <td colSpan={columns.length + 1} className="loading-cell" style={{ textAlign: 'center', padding: '2rem' }}>
                    <span style={{ fontSize: '1.1rem', color: '#666' }}>No hay consultas</span>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                  >
                    {columns.map((column) => (
                      <td key={column} className={column.clickable ? 'table-cell table-link' : 'table-cell'}
                      data-column={column} >
                        {renderCell(column, row)}
                      </td>
                    ))}
                    {/* Acciones */}
                    <td>
                      <div className="action-buttons-table">
                        <button
                          className="btn-view"
                          onClick={() =>
                            window.location.href = `mailto:${row.email}?subject=Respuesta%20a%20tu%20consulta&body=Hola%20${row.nombre},%0A%0AGracias%20por%20tu%20mensaje...`}
                        ><i className="fa-solid fa-message"></i> Responder
                        </button>


                        <button className="btn-delete" onClick={() => eliminarConsulta(row.id)} title="Eliminar">
                          <i className="fas fa-trash"></i> Eliminar
                        </button>
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

    {/* Paginación */}
    {sortedData.length > itemsPerPage && (
      <div className="pagination-container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        padding: '10px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ color: '#fff', fontSize: '14px' }}>
          Mostrando {startIndex + 1} - {Math.min(endIndex, sortedData.length)} de {sortedData.length} resultados
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 1 ? '#444' : 'var(--naranja)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Anterior
          </button>
          <span style={{ color: '#fff', fontSize: '14px' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === totalPages ? '#444' : 'var(--naranja)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Siguiente
          </button>
        </div>
      </div>
    )}
  </div>
);
};

export default TablaBackend;
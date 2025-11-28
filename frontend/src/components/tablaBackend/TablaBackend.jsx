import { useState, useMemo } from "react";
import ContactoService from "../../services/contacto.service";
import Swal from 'sweetalert2';
const TablaBackend = ({
  columns,
  data,
}) => {

  const [consulta, setConsulta] = useState([]);
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
              {!data.length ? (
                <tr>
                  <td colSpan={columns.length} className="loading-cell">
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                      <span>Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}
                  >
                    {columns.map((column) => (
                      <td key={column} className={column.clickable ? 'table-cell table-link' : 'table-cell'} >
                        {renderCell(column, row)}
                      </td>
                    ))}
                    {/* Acciones */}
                    <td>
                      <div className="action-buttons-table-contacto">
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
  </div>
);
};

export default TablaBackend;
import React, { useState, useEffect, useMemo } from 'react';
import './ModalAgregarEjercicio.css';
import PopUpEdit from '../popUpEdit/PopUpEdit';
import { getEjercicioFields } from '../popUpEdit/fields/ejercicioFields';

const ModalAgregarEjercicio = ({
  isOpen,
  onClose,
  ejerciciosDisponibles,
  crearNuevoEjercicio,
  nuevoEjercicio,
  onToggleCrearNuevo,
  onNuevoEjercicioChange,
  onAgregarEjercicioExistente,
  onCrearYAgregarEjercicio,
  onResetForm
}) => {
  const [showPopUpEdit, setShowPopUpEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sincronizar el estado de PopUpEdit con crearNuevoEjercicio
  useEffect(() => {
    if (isOpen && crearNuevoEjercicio) {
      setShowPopUpEdit(true);
    } else if (!crearNuevoEjercicio) {
      setShowPopUpEdit(false);
    }
  }, [isOpen, crearNuevoEjercicio]);

  // Resetear búsqueda cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Filtrar ejercicios según el término de búsqueda
  const ejerciciosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) {
      return ejerciciosDisponibles;
    }
    
    const termino = searchTerm.toLowerCase().trim();
    return ejerciciosDisponibles.filter(ejercicio => {
      const nombre = ejercicio.nombre?.toLowerCase() || '';
      const detalle = ejercicio.detalle?.toLowerCase() || '';
      const tipo = ejercicio.tipo?.toLowerCase() || '';
      const grupoMuscular = ejercicio.grupo_muscular?.toLowerCase() || '';
      
      return nombre.includes(termino) || 
             detalle.includes(termino) || 
             tipo.includes(termino) || 
             grupoMuscular.includes(termino);
    });
  }, [ejerciciosDisponibles, searchTerm]);

  if (!isOpen) return null;

  // Si estamos en modo crear nuevo ejercicio, usar PopUpEdit
  if (crearNuevoEjercicio) {
    return (
      <PopUpEdit
        isOpen={showPopUpEdit}
        onClose={() => {
          setShowPopUpEdit(false);
          onToggleCrearNuevo();
          onResetForm();
        }}
        mode="create"
        initialData={nuevoEjercicio}
        fields={getEjercicioFields({ mode: 'create' })}
        onSubmit={async (data) => {
          // Actualizar el estado local con los datos del formulario
          Object.keys(data).forEach(key => {
            onNuevoEjercicioChange(key, data[key] || '');
          });
          
          // Llamar a la función que crea y agrega el ejercicio pasando los datos directamente
          await onCrearYAgregarEjercicio(data);
        }}
        title="Crear Nuevo Ejercicio"
        entityName="ejercicio"
        submitButtonText="Crear y Agregar"
      />
    );
  }

  // Modo lista de ejercicios disponibles
  return (
    <div className="modal-agregar-ejercicio-overlay" onClick={onClose}>
      <div className="modal-agregar-ejercicio-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-agregar-ejercicio-header">
          <h2>Agregar Ejercicio</h2>
          <button
            onClick={onResetForm}
            className="modal-agregar-ejercicio-close"
          >
            ×
          </button>
        </div>

        <div className="modal-agregar-ejercicio-actions">
          <button
            onClick={onToggleCrearNuevo}
            className="modal-btn modal-btn-create"
          >
            + Crear Nuevo Ejercicio
          </button>
        </div>

        <div className="modal-agregar-ejercicio-list">
          <h3>Ejercicios Disponibles</h3>
          
          {/* Search bar */}
          <div className="modal-agregar-ejercicio-search">
            <input
              type="text"
              placeholder="Buscar ejercicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modal-agregar-ejercicio-search-input"
            />
          </div>

          <div className="modal-agregar-ejercicio-scroll">
            {ejerciciosFiltrados.length === 0 ? (
              <p className="modal-agregar-ejercicio-empty">
                {searchTerm.trim() 
                  ? `No se encontraron ejercicios que coincidan con "${searchTerm}"` 
                  : 'No hay ejercicios disponibles'}
              </p>
            ) : (
              ejerciciosFiltrados.map(ejercicio => (
                <div
                  key={ejercicio.id_ejercicio}
                  onClick={() => onAgregarEjercicioExistente(ejercicio.id_ejercicio)}
                  className="modal-agregar-ejercicio-item"
                >
                  <div className="modal-agregar-ejercicio-item-name">
                    {ejercicio.nombre}
                  </div>
                  {ejercicio.detalle && (
                    <div className="modal-agregar-ejercicio-item-detail">
                      {ejercicio.detalle.substring(0, 100)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarEjercicio;

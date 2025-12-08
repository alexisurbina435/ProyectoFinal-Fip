import { useEffect } from "react";
import { useForm } from "react-hook-form";
import "./PopUpEdit.css";
import Input from "../input-icon/Input";
import Label from "../labelContacto/Label";
import BotonForm from "../botonForm/BotonForm";

/* PopUp reutilizable para crear, editar o ver detalles

  {boolean} props.isOpen - Controla si el modal está abierto
  {Function} props.onClose - Función para cerrar el modal
  {string} props.mode - 'create', 'edit' o 'view'
  {Object} props.initialData - Datos iniciales para modo 'edit' o 'view'
  {Array} props.fields - Configuración de campos del formulario
  {Function} props.onSubmit - Función que se ejecuta al enviar el formulario (no requerida en modo 'view')
  {string} props.title - Título del modal
  {string} props.entityName - Nombre de la entidad (para mensajes)
 */
const PopUpEdit = ({
  isOpen,
  onClose,
  mode = 'create',
  initialData = {},
  fields = [],
  onSubmit,
  title,
  entityName = 'entidad',
  customContent = null,
  onEditar = null,
  onEliminar = null,
  submitButtonText = null
}) => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: initialData
  });

  // Resetear formulario cuando cambian los datos iniciales o el modo
  useEffect(() => {
    if (isOpen) {
      reset(mode === 'edit' || mode === 'view' ? initialData : {});
    }
  }, [isOpen, mode, initialData, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      // El error se maneja en la función onSubmit del componente padre
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const modalTitle = title || (
    mode === 'create' ? `Agregar ${entityName}` : 
    mode === 'view' ? `Detalles de ${entityName}` : 
    `Editar ${entityName}`
  );

  return (
    <>
      <div className="popup-overlay" onClick={handleCancel}></div>
      <dialog className="popup-dialog" open={isOpen}>
        <div className="popup-container">
          <div className="popup-header">
            <h2 className="popup-title">{modalTitle}</h2>
            <button className="popup-close-btn" onClick={handleCancel} aria-label="Cerrar">
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form className="popup-form" onSubmit={isViewMode ? (e) => { e.preventDefault(); } : handleSubmit(handleFormSubmit)}>
            <div className="popup-form-content">
              {fields.map((field) => {
                const fieldValue = watch(field.name);
                // En modo view, todos los campos están deshabilitados
                const isDisabled = isViewMode || field.disabled || (field.disabledWhen && field.disabledWhen(fieldValue));

                return (
                  <div key={field.name} className="popup-input-group">
                    <Label htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="required-asterisk"> *</span>}
                    </Label>
                    
                    <div className="popup-input-wrapper">
                      {field.icon && (
                        <i className={`${field.icon} popup-input-icon`}></i>
                      )}
                      
                      {field.type === 'textarea' ? (
                        <textarea
                          id={field.name}
                          placeholder={field.placeholder}
                          disabled={isDisabled}
                          {...register(field.name, field.validation || {})}
                          className={`popup-input ${errors[field.name] ? 'input-error' : ''}`}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          id={field.name}
                          disabled={isDisabled}
                          {...register(field.name, field.validation || {})}
                          className={`popup-input popup-select ${errors[field.name] ? 'input-error' : ''}`}
                        >
                          <option value="">Seleccione una opción</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'checkbox' ? (
                        <div className="popup-checkbox-wrapper">
                          <input
                            type="checkbox"
                            id={field.name}
                            disabled={isDisabled}
                            {...register(field.name, field.validation || {})}
                            className="popup-checkbox"
                          />
                          {field.checkboxLabel && (
                            <label htmlFor={field.name} className="popup-checkbox-label">
                              {field.checkboxLabel}
                            </label>
                          )}
                        </div>
                      ) : (
                        <Input
                          type={field.type || 'text'}
                          id={field.name}
                          placeholder={field.placeholder}
                          disabled={isDisabled}
                          {...register(field.name, field.validation || {})}
                          className={`popup-input ${errors[field.name] ? 'input-error' : ''}`}
                        />
                      )}
                    </div>
                    
                    {!isViewMode && errors[field.name] && (
                      <span className="popup-error-message">
                        {errors[field.name].message}
                      </span>
                    )}
                    
                    {field.helpText && (
                      <span className="popup-help-text">{field.helpText}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contenido personalizado (se renderiza después de los campos) */}
            {customContent && customContent}

            <div className="popup-form-actions">
              {isViewMode ? (
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <BotonForm type="button" onClick={handleCancel} className="btn-cancel">
                    Cerrar
                  </BotonForm>
                  {onEditar && (
                    <BotonForm 
                      type="button" 
                      onClick={() => {
                        const id = initialData.id || initialData.id_usuario || initialData.id_ejercicio || initialData.id_rutina || initialData.id_producto;
                        if (id) {
                          onClose();
                          onEditar(id);
                        }
                      }} 
                      className="btn-edit-view"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </BotonForm>
                  )}
                  {onEliminar && (
                    <BotonForm 
                      type="button" 
                      onClick={() => {
                        const id = initialData.id || initialData.id_usuario || initialData.id_ejercicio || initialData.id_rutina || initialData.id_producto;
                        if (id) {
                          onClose();
                          onEliminar(id);
                        }
                      }} 
                      className="btn-delete-view"
                    >
                      <i className="fas fa-trash"></i> Eliminar
                    </BotonForm>
                  )}
                </div>
              ) : (
                <>
                  <BotonForm type="button" onClick={handleCancel} className="btn-cancel">
                    Cancelar
                  </BotonForm>
                  <BotonForm type="submit" className="btn-submit">
                    {submitButtonText || (mode === 'create' ? 'Crear' : 'Guardar Cambios')}
                  </BotonForm>
                </>
              )}
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default PopUpEdit;


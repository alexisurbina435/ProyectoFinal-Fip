// Configuración de campos para el formulario de productos
// Según CreateProductoDto

export const getProductoFields = ({ mode = 'create' } = {}) => {
  return [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del producto',
      required: true,
      icon: 'fa-solid fa-box',
      validation: {
        required: 'El nombre es requerido',
        minLength: {
          value: 3,
          message: 'El nombre debe tener entre 3 y 30 caracteres'
        },
        maxLength: {
          value: 30,
          message: 'El nombre debe tener entre 3 y 30 caracteres'
        }
      }
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Ingrese la descripción del producto',
      required: true,
      validation: {
        required: 'La descripción es requerida',
        minLength: {
          value: 3,
          message: 'La descripción debe tener entre 3 y 100 caracteres'
        },
        maxLength: {
          value: 100,
          message: 'La descripción debe tener entre 3 y 100 caracteres'
        }
      }
    },
    {
      name: 'imagen',
      label: 'URL de Imagen',
      type: 'text',
      placeholder: 'ejemplo: producto.jpg o /images/producto.jpg',
      required: true,
      icon: 'fa-regular fa-image',
      validation: {
        required: 'La URL de la imagen es requerida'
      }
    },
    {
      name: 'precio',
      label: 'Precio',
      type: 'number',
      placeholder: '0.00',
      required: true,
      icon: 'fa-solid fa-dollar-sign',
      validation: {
        required: 'El precio es requerido',
        min: {
          value: 0.01,
          message: 'El precio debe ser mayor a 0'
        }
      }
    },
    {
      name: 'stock',
      label: 'Stock',
      type: 'number',
      placeholder: '0',
      required: true,
      icon: 'fa-solid fa-warehouse',
      validation: {
        required: 'El stock es requerido',
        min: {
          value: 0,
          message: 'El stock no puede ser negativo'
        }
      }
    },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'text',
      placeholder: 'Ej: Suplementos, Equipamiento, Accesorios',
      required: true,
      icon: 'fa-solid fa-tags',
      validation: {
        required: 'La categoría es requerida'
      }
    }
  ];
};


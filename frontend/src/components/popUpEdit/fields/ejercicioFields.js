// Configuración de campos para el formulario de ejercicios
// Segun CreateEjercicioDto

export const getEjercicioFields = ({ mode = 'create' } = {}) => {
  return [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Nombre del ejercicio',
      required: true,
      icon: 'fa-solid fa-dumbbell',
      validation: {
        required: 'El nombre es requerido',
        minLength: {
          value: 3,
          message: 'El nombre debe tener al menos 3 caracteres'
        },
        maxLength: {
          value: 100,
          message: 'El nombre debe tener menos de 100 caracteres'
        }
      }
    },
    {
      name: 'detalle',
      label: 'Descripción',
      type: 'textarea',
      placeholder: 'Descripción del ejercicio',
      required: false,
      validation: {
        maxLength: {
          value: 500,
          message: 'La descripción debe tener menos de 500 caracteres'
        }
      }
    },
    {
      name: 'tipo',
      label: 'Tipo',
      type: 'text',
      placeholder: 'Tipo de ejercicio (ej: fuerza, cardio, flexibilidad)',
      required: false,
      icon: 'fa-solid fa-tag',
      validation: {
        maxLength: {
          value: 50,
          message: 'El tipo debe tener menos de 50 caracteres'
        }
      }
    },
    {
      name: 'grupo_muscular',
      label: 'Grupo Muscular',
      type: 'text',
      placeholder: 'Grupo muscular (ej: pecho, espalda, piernas)',
      required: false,
      icon: 'fa-solid fa-dumbbell',
      validation: {
        maxLength: {
          value: 50,
          message: 'El grupo muscular debe tener menos de 50 caracteres'
        }
      }
    },
    {
      name: 'img_url',
      label: 'URL de Imagen',
      type: 'text',
      placeholder: 'https://... o /images/flexiones.jpg',
      required: false,
      icon: 'fa-regular fa-image',
      validation: {
        maxLength: {
          value: 500,
          message: 'La URL debe tener menos de 500 caracteres'
        }
      }
    },
    {
      name: 'video_url',
      label: 'URL de Video',
      type: 'text',
      placeholder: 'https://... o /videos/flexiones.mp4',
      required: false,
      icon: 'fa-solid fa-video',
      validation: {
        maxLength: {
          value: 500,
          message: 'La URL debe tener menos de 500 caracteres'
        }
      }
    }
  ];
};


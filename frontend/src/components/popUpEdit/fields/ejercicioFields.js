// Configuración de campos para el formulario de ejercicios
// Segun CreateEjercicioDto

export const getEjercicioFields = ({ mode = 'create' } = {}) => {
  return [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre del ejercicio',
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
      placeholder: 'Ingrese la descripción del ejercicio',
      required: true,
      validation: {
        required: 'La descripción es requerida',
        minLength: {
          value: 10,
          message: 'La descripción debe tener al menos 10 caracteres'
        },
        maxLength: {
          value: 500,
          message: 'La descripción debe tener menos de 500 caracteres'
        }
      }
    },
    {
      name: 'img_url',
      label: 'URL de Imagen',
      type: 'text',
      placeholder: 'ejemplo: flexiones.jpg o /images/flexiones.jpg',
      required: true,
      icon: 'fa-regular fa-image',
      validation: {
        required: 'La URL de la imagen es requerida',
        pattern: {
          value: /^[a-zA-Z0-9._/-]+\.(jpg|jpeg|png|gif|webp)$/i,
          message: 'La URL debe ser un archivo de imagen válido'
        }
      }
    },
    {
      name: 'video_url',
      label: 'URL de Video',
      type: 'text',
      placeholder: 'ejemplo: flexiones.mp4 o /videos/flexiones.mp4',
      required: true,
      icon: 'fa-solid fa-video',
      validation: {
        required: 'La URL del video es requerida',
        pattern: {
          value: /^[a-zA-Z0-9._/-]+\.(mp4|webm|ogg)$/i,
          message: 'La URL debe ser un archivo de video válido (mp4, webm, ogg)'
        }
      }
    }
  ];
};


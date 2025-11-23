const planOptions = [
  { value: 'Basic', label: 'Plan Basico' },
  { value: 'Medium', label: 'Plan Medium' },
  { value: 'Premium', label: 'Plan Premium' }
];

export const getPlanLabel = (tipoPlan) => {
  const found = planOptions.find((option) => option.value === tipoPlan);
  return found ? found.label : (tipoPlan || 'Sin plan');
};

const phoneRegex = /^(\+54\s\d\s)?\d{3,4}[-\s]?\d{4}$/;

export const getUsuarioFields = ({ mode = 'create' } = {}) => {
  const isCreateMode = mode === 'create';

  return [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Ingrese el nombre',
      required: true,
      icon: 'fa-regular fa-user',
      validation: {
        required: 'El nombre es requerido',
        pattern: {
          value: /^[A-Za-z\s]+$/,
          message: 'El nombre solo puede contener letras y espacios'
        },
        minLength: {
          value: 3,
          message: 'El nombre debe tener al menos 3 caracteres'
        },
        maxLength: {
          value: 30,
          message: 'El nombre debe tener menos de 30 caracteres'
        }
      }
    },
    {
      name: 'apellido',
      label: 'Apellido',
      type: 'text',
      placeholder: 'Ingrese el apellido',
      required: true,
      icon: 'fa-regular fa-user',
      validation: {
        required: 'El apellido es requerido',
        pattern: {
          value: /^[A-Za-z\s]+$/,
          message: 'El apellido solo puede contener letras y espacios'
        },
        minLength: {
          value: 3,
          message: 'El apellido debe tener al menos 3 caracteres'
        }
      }
    },
    {
      name: 'dni',
      label: 'DNI',
      type: 'number',
      placeholder: 'Ingrese el DNI',
      required: true,
      icon: 'fa-regular fa-id-card',
      validation: {
        required: 'El DNI es requerido',
        min: {
          value: 1000000,
          message: 'El DNI debe tener al menos 7 dígitos'
        },
        max: {
          value: 99999999,
          message: 'El DNI debe tener máximo 8 dígitos'
        }
      }
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'ejemplo@email.com',
      required: true,
      icon: 'fa-regular fa-envelope',
      validation: {
        required: 'El email es requerido',
        pattern: {
          value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
          message: 'El email no es válido'
        }
      }
    },
    {
      name: 'telefono',
      label: 'Teléfono',
      type: 'text',
      placeholder: '+54 9 1234-5678',
      required: true,
      icon: 'fa-solid fa-phone',
      validation: {
        required: 'El teléfono es requerido',
        pattern: {
          value: phoneRegex,
          message: 'El teléfono no es válido. Ej: +54 9 1234-5678'
        }
      }
    },
    {
      name: 'password',
      label: 'Contraseña',
      type: 'password',
      placeholder: 'Ingrese la contraseña',
      required: isCreateMode,
      icon: 'fa-solid fa-lock',
      validation: isCreateMode
        ? {
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres'
            },
            maxLength: {
              value: 14,
              message: 'La contraseña debe tener menos de 14 caracteres'
            }
          }
        : {}
    },
    {
      name: 'rol',
      label: 'Rol',
      type: 'select',
      required: true,
      options: [
        { value: 'Usuario', label: 'Usuario' },
        { value: 'Admin', label: 'Administrador' }
      ],
      validation: {
        required: 'El rol es requerido'
      }
    },
    {
      name: 'tipoPlan',
      label: 'Tipo de Plan',
      type: 'select',
      required: false,
      options: planOptions
    },
    {
      name: 'estado_pago',
      label: 'Estado de Pago',
      type: 'checkbox',
      checkboxLabel: 'Pago activo',
      validation: {}
    }
  ];
};

export { planOptions };


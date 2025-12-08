// Validar datos de rutina antes de guardar
export const validarDatosRutina = (rutina, datosEditados, tipoRutina, idUsuario, categoria) => {
  const nombre = datosEditados.nombre !== undefined ? datosEditados.nombre : rutina.nombre;
  if (!nombre || nombre.trim() === '') {
    return {
      valido: false,
      mensaje: 'El nombre de la rutina es requerido'
    };
  }

  // Si es tipo cliente, debe tener usuario
  if (tipoRutina === 'cliente' && !idUsuario) {
    return {
      valido: false,
      mensaje: 'Debe seleccionar un cliente para rutinas de tipo cliente'
    };
  }

  // Si es tipo plan, debe tener categoría válida
  if (tipoRutina === 'plan') {
    const categoriasValidas = ['Basic', 'Medium', 'Premium'];
    if (!categoria || !categoriasValidas.includes(categoria)) {
      return {
        valido: false,
        mensaje: 'Debe seleccionar una categoría válida (Basic, Medium o Premium) para rutinas de tipo plan'
      };
    }
  }

  return { valido: true };
};

// Formatear nivel para mostrar
export const formatearNivel = (nivel) => {
  if (!nivel) return 'N/A';
  return nivel.charAt(0).toUpperCase() + nivel.slice(1);
};

// Formatear tipo de rutina para mostrar
export const formatearTipoRutina = (tipo) => {
  const tipos = {
    'general': 'General',
    'cliente': 'Cliente',
    'plan': 'Plan'
  };
  return tipos[tipo] || 'N/A';
};


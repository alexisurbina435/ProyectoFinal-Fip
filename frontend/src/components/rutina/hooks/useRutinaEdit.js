import { useState, useMemo } from 'react';

export const useRutinaEdit = (rutina, rutinaOriginal) => {
  const [datosEditados, setDatosEditados] = useState({});
  const [editando, setEditando] = useState(false);
  const [ejerciciosEliminados, setEjerciciosEliminados] = useState(new Set());

  const handleEditarCampo = (campo, valor) => {
    setDatosEditados(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const requiereNuevaRutina = useMemo(() => {
    if (!rutinaOriginal || !rutina) return false;
    
    const nivelOriginal = rutinaOriginal.nivel;
    const nivelActual = datosEditados.nivel !== undefined ? datosEditados.nivel : rutina.nivel;
    if (nivelOriginal !== nivelActual) return true;
    
    const categoriaOriginal = rutinaOriginal.categoria;
    const categoriaActual = datosEditados.categoria !== undefined ? datosEditados.categoria : rutina.categoria;
    if (categoriaOriginal !== categoriaActual) return true;
    
    const usuarioOriginalId = rutinaOriginal.usuario?.id_usuario || null;
    const usuarioActualId = datosEditados.id_usuario !== undefined 
      ? datosEditados.id_usuario 
      : (rutina.usuario?.id_usuario || null);
    if (usuarioOriginalId !== usuarioActualId) return true;
    
    const tipoOriginal = rutinaOriginal.tipo_rutina;
    const tipoActual = datosEditados.tipo_rutina !== undefined ? datosEditados.tipo_rutina : rutina.tipo_rutina;
    if (tipoOriginal !== tipoActual) return true;
    
    return false;
  }, [rutinaOriginal, rutina, datosEditados]);

  const tieneCambios = Object.keys(datosEditados).length > 0 || ejerciciosEliminados.size > 0;

  const resetEdit = () => {
    setEditando(false);
    setDatosEditados({});
    setEjerciciosEliminados(new Set());
  };

  return {
    datosEditados,
    editando,
    ejerciciosEliminados,
    requiereNuevaRutina,
    tieneCambios,
    handleEditarCampo,
    setEditando,
    setEjerciciosEliminados,
    resetEdit
  };
};


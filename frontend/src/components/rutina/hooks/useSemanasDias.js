import { useState, useEffect, useMemo } from 'react';

export const useSemanasDias = (rutina) => {
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  // Establecer valores por defecto cuando cambia la rutina (solo si no hay selección previa)
  useEffect(() => {
    if (rutina?.semanas && rutina.semanas.length > 0) {
      // Solo establecer valores por defecto si no hay selección previa
      if (!semanaSeleccionada) {
        const primeraSemana = rutina.semanas[0];
        setSemanaSeleccionada(primeraSemana.id_semana);
        
        if (primeraSemana.dias && primeraSemana.dias.length > 0) {
          setDiaSeleccionado(primeraSemana.dias[0].id_dia);
        }
      } else {
        // Verificar que la semana seleccionada aún existe en la rutina actualizada
        const semanaExiste = rutina.semanas.find(s => s.id_semana === semanaSeleccionada);
        if (!semanaExiste && rutina.semanas.length > 0) {
          // Si la semana seleccionada ya no existe, seleccionar la primera
          const primeraSemana = rutina.semanas[0];
          setSemanaSeleccionada(primeraSemana.id_semana);
          
          if (primeraSemana.dias && primeraSemana.dias.length > 0) {
            setDiaSeleccionado(primeraSemana.dias[0].id_dia);
          }
        }
      }
    }
  }, [rutina?.id_rutina]);

  const semanasDisponibles = useMemo(() => {
    if (!rutina || !rutina.semanas) return [];
    return rutina.semanas.sort((a, b) => a.numero_semana - b.numero_semana);
  }, [rutina]);

  const diasDisponibles = useMemo(() => {
    if (!rutina || !semanaSeleccionada) return [];
    const semana = rutina.semanas?.find(s => s.id_semana === semanaSeleccionada);
    if (!semana || !semana.dias) return [];
    return semana.dias.sort((a, b) => a.numero_dia - b.numero_dia);
  }, [rutina, semanaSeleccionada]);

  // Actualizar día seleccionado cuando cambia la semana
  useEffect(() => {
    if (diasDisponibles.length > 0 && !diasDisponibles.find(d => d.id_dia === diaSeleccionado)) {
      setDiaSeleccionado(diasDisponibles[0].id_dia);
    }
  }, [semanaSeleccionada, diasDisponibles]);

  const handleSemanaChange = (e) => {
    const nuevaSemanaId = parseInt(e.target.value);
    setSemanaSeleccionada(nuevaSemanaId);
  };

  const handleDiaChange = (e) => {
    const nuevoDiaId = parseInt(e.target.value);
    setDiaSeleccionado(nuevoDiaId);
  };

  return {
    semanaSeleccionada,
    diaSeleccionado,
    semanasDisponibles,
    diasDisponibles,
    setSemanaSeleccionada,
    setDiaSeleccionado,
    handleSemanaChange,
    handleDiaChange
  };
};


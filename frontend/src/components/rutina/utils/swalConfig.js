import Swal from 'sweetalert2';

// Configurar z-index global para SweetAlert2 cuando está en modal
export const SwalWithHighZIndex = Swal.mixin({
  customClass: {
    container: 'swal2-container-high-z'
  }
});

export const getSwalInstance = (isModal) => {
  return isModal ? SwalWithHighZIndex : Swal;
};


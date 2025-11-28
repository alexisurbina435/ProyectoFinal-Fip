import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import usuarioService from "../services/usuario.service";
import { useState, useEffect } from "react";
export const UseFormPerfil = () => {

    const formNombre = useForm();
    const formEmail = useForm();
    const formPassword = useForm();
    const formTelefono = useForm();


    //esto no pertenece al use form pero es necesario en el perfilUsuario
    const [sectionActiva, setSectionActiva] = useState("nombre");

    const [data, setData] = useState([]);
    const getUsuario = async () => {
        const data = await usuarioService.getUsuarioById();
        setData(data);
    }

    useEffect(() => {
        getUsuario();
    }, []);
    //esto no pertenece al use form pero es necesario en el perfilUsuario

    // editar nombre 
    const editarNombre = async (formNombreData) => {
        try {
            const usuario = await usuarioService.getUsuarioById();

            const edit = {
                nombre: formNombreData.nombre,
                apellido: formNombreData.apellido,
            };

            const cambiarNombre = await usuarioService.editarUsuario(usuario.id_usuario, edit);
            Swal.fire({
            title: 'Nombre modificado exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {
            setData(cambiarNombre);
            formNombre.reset();
        })

        } catch (error) {
            console.error("Error al editar nombre:", error);
        }
    };
    const onSubmitNombre = formNombre.handleSubmit((data) => {
        editarNombre(data);
    });

    //editar correo
    const editarEmail = async (formEmailData) => {
        try {
            const usuario = await usuarioService.getUsuarioById();
            const edit = {
                email: formEmailData.email,
            };
            const cambiarCorreo = await usuarioService.editarUsuario(usuario.id_usuario, edit);
            setData(cambiarCorreo);
            Swal.fire({
                title: 'Correo modificado exitosamente!',
                text: 'Tu correo ha sido modificado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                formEmail.reset();
            });
        } catch (error) {
            Swal.fire({
                title: 'Correo ya registrado!',
                text: 'El correo ingresado ya se encuentra registrado.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    const onSubmitEmail = formEmail.handleSubmit((data) => {
        editarEmail(data);
    });


    // editar telefono 
    const editarTelefono = async (formTelefonoData) => {
        try {
            const usuario = await usuarioService.getUsuarioById();
            const edit = {
                telefono: formTelefonoData.telefono,
            };
            const cambiarTelefono = await usuarioService.editarUsuario(usuario.id_usuario, edit);
            setData(cambiarTelefono);
            Swal.fire({
                title: 'Telefono modificado exitosamente!',
                text: 'Tu telefono ha sido modificado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                formTelefono.reset();
            });
        } catch (error) {
            console.error("Error al editar telefono:", error);
        }
    }

    const onSubmitTelefono = formTelefono.handleSubmit((data) => {
        editarTelefono(data);
    })
    
    // editar Password 
    const editarPassword = async (formPasswordData) => {
        try {
            const usuario = await usuarioService.getUsuarioById();
            const edit = {
                password: formPasswordData.password,
            };
            const cambiarPassword = await usuarioService.editarUsuario(usuario.id_usuario, edit);
            setData(cambiarPassword);
            Swal.fire({
                title: 'Password modificado exitosamente!',
                text: 'Tu password ha sido modificado.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                formPassword.reset();
            });
        } catch (error) {
            console.error("Error al editar password:", error);
        }
    }
    const onsubmitPassword = formPassword.handleSubmit((data) => {
        editarPassword(data);
    })


     return {
    data,
    sectionActiva,
    setSectionActiva,
    formNombre,
    formEmail,
    formTelefono,
    formPassword,
    editarNombre,
    editarEmail,
    editarTelefono,
    onSubmitEmail,
    onSubmitNombre,
    onSubmitTelefono,
    onsubmitPassword
  };

}
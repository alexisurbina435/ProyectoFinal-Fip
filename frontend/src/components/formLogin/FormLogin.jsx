import { useForm } from "react-hook-form";
import "./FormLogin.css";
// import "../formContacto/formContacto.css";
import logo2 from "../../assets/images/logo2.png";
// import Modal from "../modal/Modal";
import Input from "../input-icon/Input";
import Label from "../labelContacto/Label";
import BotonLogin from "../botonLogin/BotonLogin";
import { Link } from "react-router-dom";
import usuarioService from "../../services/usuario.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import authService from "../../services/auth.service";
export default function FormLogin() {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [data, setData] = useState([]);
    const login = async (usuarioData) => {
        try {
            const iniciarSesion = await authService.login(usuarioData);
            setData(iniciarSesion);
            navigate('/');
            window.location.reload();
        } catch (error) {
            Swal.fire({
                title: 'Inicio de sesión fallido',
                text: "Email o contraseña incorrectas",
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }

    }
    const onSubmit = handleSubmit((data) => {
        login(data)
    })

    return (
        <>
            <section className="contacto-container">
                <img src={logo2} alt="login-logo" className="contact-logo" />

                <form action="" className="formulario" id="formulario" onSubmit={onSubmit}>

                    <div className="input-group">
                        <Label htmlFor="email" children="Correo electrónico" />
                        <div className="input-wrapper">
                            <i className="fa-regular fa-envelope form-icon"></i>
                            <Input type="email" id="email" placeholder="ejemplo123@gmail.com" {...register("email",
                                {
                                    required: {
                                        value: true,
                                        message: "El correo es requerido"
                                    },
                                    pattern: {
                                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                                        message: "El correo no es valido"
                                    },
                                })} />
                        </div>
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                        <Label htmlFor="password" children="Contraseña" />
                        <div className="input-wrapper">
                            <i className="fa-solid fa-lock form-icon"></i>
                            <Input type="password" id="password" placeholder="Ingrese su contraseña" {...register("password",
                                {
                                    required: {
                                        value: true,
                                        message: "La contraseña es requerida"
                                    },


                                })} />
                        </div>
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>

                    <div className="remember-me">
                        <input type="checkbox" id="remember-me" />
                        <span>Recuerdame</span>
                    </div>

                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>

                    <BotonLogin type="submit" id="showPopup" className="btn btn-login">Iniciar sesion</BotonLogin>
                    <Link to="/registro" className="btn btn-register" >Registrarse</Link>

                </form>
                {/* <Modal mensaje="Inicio de sesion exitoso" /> */}
            </section>
        </>
    );
}
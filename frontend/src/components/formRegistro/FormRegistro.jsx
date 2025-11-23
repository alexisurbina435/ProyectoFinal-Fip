import { useForm } from "react-hook-form";
import "./FormRegistro.css";
// import "../formContacto/formContacto.css";
import logo2 from "../../assets/images/logo2.png";
// import Modal from "../modal/Modal";
import Input from "../input-icon/Input";
import Label from "../labelContacto/Label";
import BotonLogin from "../botonLogin/BotonLogin";
import { Link } from "react-router-dom";
import usuarioService from "../../services/usuario.service";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate  } from "react-router-dom";

export default function FormRegistro() {

    const navigate = useNavigate ();
    
    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

    const [data, setData] = useState([]);

    const registro = async (usuarioData) => {
        try {
            const crearUsuario = await usuarioService.register(usuarioData);
            setData(crearUsuario);
            Swal.fire({
                title: 'Registro exitoso!',
                text: 'Tu cuenta ha sido creada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                reset();
                navigate('/login');
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

    const onSubmit = handleSubmit((data) => {
        registro(data);
    })

    return (
        <>
            <section className="contacto-container">
                <img src={logo2} alt="registro-logo" className="contact-logo" />

                <form action="" className="formulario" id="formulario" onSubmit={onSubmit}>

                    <div className="input-group">
                        <Label htmlFor="name" children="Nombre" />
                        <div className="input-wrapper">
                            <i className="fa-regular fa-user icon-register"></i>
                            <Input type="text" id="name" placeholder="Ingrese su nombre" {...register("nombre", {
                                required: {
                                    value: true,
                                    message: "El nombre es requerido"
                                },
                                pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "El nombre solo puede contener letras y espacios"
                                },
                                minLength: {
                                    value: 3,
                                    message: "El nombre debe tener al menos 3 caracteres"
                                }
                            })} />
                        </div>
                        {errors.nombre && <span className="error">{errors.nombre.message}</span>}
                    </div>

                    <div className="input-group">
                        <Label htmlFor="apellido" children="Apellido" />
                        <div className="input-wrapper">
                            <i className="fa-regular fa-user icon-register"></i>
                            <Input type="text" id="apellido" placeholder="Ingrese su apellido"  {...register("apellido", {
                                required: {
                                    value: true,
                                    message: "El apellido es requerido"
                                },
                                pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message: "El apellido solo puede contener letras y espacios"
                                },
                                minLength: {
                                    value: 3,
                                    message: "El apellido debe tener al menos 3 caracteres"
                                }
                            })} />
                        </div>
                        {errors.apellido && <span className="error">{errors.apellido.message}</span>}
                    </div>

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
                                    }
                                })} />
                        </div>
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                        <Label htmlFor="telefono" children="Teléfono" />
                        <div className="input-wrapper">
                            <i className="fa-solid fa-phone form-icon"></i>
                            <Input type="tel" id="phone" placeholder="+54 2284 265448" {...register("telefono",
                                {
                                    required: {
                                        value: true,
                                        message: "El telefono es requerido"
                                    },
                                    minLength: {
                                        value: 6,
                                        message: "El telefono debe tener al menos 6 caracteres"
                                    },
                                    pattern: {
                                        value: /^(\+54 )?\d{3,4} \d{6}$/,
                                        message: "El telefono no es valido"
                                    }
                                }
                            )} />
                        </div>
                        {errors.telefono && <span className="error">{errors.telefono.message}</span>}
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
                                    minLength: {
                                        value: 6,
                                        message: "La contraseña debe tener al menos 6 caracteres"
                                    },
                                    maxLength: {
                                        value: 14,
                                        message: "La contraseña debe tener menos de 14 caracteres"
                                    }

                                })} />
                        </div>
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>

                    <div className="input-group">
                        <Label htmlFor="confirmPassword" children="Repetir contraseña" />
                        <div className="input-wrapper">
                            <i className="fa-solid fa-lock form-icon"></i>
                            <Input type="password" id="confirmPassword" placeholder="Repita su contraseña" {...register("confirmPassword",
                                {
                                    required: {
                                        value: true,
                                        message: "Por favor confirme su contraseña"
                                    },
                                    validate: (value) => {
                                        if (value === watch('password')) return true;
                                        return "Las contraseñas no coinciden"
                                    }

                                })} />
                        </div>
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
                    </div>

                    <div className="checkboxes">
                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" id="accept-emails" />
                                Acepto recibir comunicaciones de Superarse Gym por email
                            </label>
                        </div>

                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" id="accept-whatsapp" />
                                Acepto recibir comunicaciones de Superarse Gym por WhatsApp
                            </label>
                        </div>

                        <div className="checkbox-group">
                            <label>
                                <input type="checkbox" id="accept-terms" />
                                Acepto los <a href="#" target="_blank">Términos de Uso</a>, <a href="#" target="_blank">Términos de
                                    Venta</a> y la <a href="#" target="_blank">Política de Privacidad</a> de Superarse Gym
                            </label>
                        </div>
                    </div>

                    <BotonLogin type="submit" id="showPopup" className="btn btn-register">Registrarse</BotonLogin>

                    <div className="go-login">
                        <Link to="/login" className="go-login">¿Ya tienes una cuenta?</Link>
                    </div>

                </form>
                {/* <Modal mensaje="Registro exitoso" /> */}
            </section>
        </>
    );
}
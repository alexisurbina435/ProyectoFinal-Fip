import { useForm } from "react-hook-form";
import "./FormLogin.css";
import logo2 from "../../assets/images/logo2.png";
import Input from "../input-icon/Input";
import Label from "../labelContacto/Label";
import BotonLogin from "../botonLogin/BotonLogin";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from 'sweetalert2';

import authService from "../../services/auth.service";
import carritoService from "../../services/carrito.service";
import { useCarrito } from "../carrito/CarritoContext";

export default function FormLogin() {

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [data, setData] = useState([]);


    const { cargarCarrito } = useCarrito();

    const login = async (usuarioData) => {
        try {
            const iniciarSesion = await authService.login(usuarioData);

            // Usuario viene directo del backend
            const user = iniciarSesion.usuario;

            if (!user) {
                throw new Error("Respuesta del backend inválida");
            }

            // Guardar usuario
            localStorage.setItem("usuario", JSON.stringify(user));
            const userId = user.id_usuario;



            // --- CARGAR CARRITO LOCAL (si existe)
            const carritoLocal = JSON.parse(localStorage.getItem("carrito")) || [];

            // --- BUSCAR CARRITO BACKEND
            let carritoBackend = await carritoService.getCarritoByUsuario(userId);

            // Si no existe → crearlo
            if (!carritoBackend || !carritoBackend.id_carrito) {
                carritoBackend = await carritoService.createCarrito(userId);
            }

            // --- SI HAY PRODUCTOS EN LOCALSTORAGE → SINCRONIZARLOS
            if (carritoLocal.length > 0) {
                carritoBackend = await carritoService.sincronizarCarrito(
                    userId,
                    carritoLocal
                );
            }

            let items = carritoBackend.items;

            if (!Array.isArray(items)) {
                console.warn("Backend devolvió items inválidos:", items);
                items = [];
            }
            for (let i =0; i < items.length; i++) {
                const item = {
                    id: items[i].producto.id_producto,
                    nombre: items[i].producto.nombre,
                    precio: items[i].producto.precio,
                    descripcion: items[i].producto.descripcion,
                    img: items[i].producto.imagen,
                    cantidad: items[i].cantidad,
                    stock: items[i].producto.stock
                }
                items[i] = item;
            }
            cargarCarrito(items); 

            // Guardar ID del carrito
            localStorage.setItem("carritoId", carritoBackend.id_carrito);

            // Limpiar carrito local (ya está en backend)
            localStorage.removeItem("carrito");

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
    };


    const onSubmit = handleSubmit((data) => {
        login(data);
    });

    return (
        <>
            <section className="contacto-container">
                <img src={logo2} alt="login-logo" className="contact-logo" />

                <form className="formulario" id="formulario" onSubmit={onSubmit}>

                    <div className="input-group">
                        <Label htmlFor="email" children="Correo electrónico" />
                        <div className="input-wrapper">
                            <i className="fa-regular fa-envelope form-icon"></i>
                            <Input
                                type="email"
                                id="email"
                                placeholder="ejemplo123@gmail.com"
                                {...register("email", {
                                    required: "El correo es requerido",
                                    pattern: {
                                        value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                                        message: "El correo no es válido"
                                    }
                                })}
                            />
                        </div>
                        {errors.email && <span className="error">{errors.email.message}</span>}
                    </div>

                    <div className="input-group">
                        <Label htmlFor="password" children="Contraseña" />
                        <div className="input-wrapper">
                            <i className="fa-solid fa-lock form-icon"></i>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Ingrese su contraseña"
                                {...register("password", {
                                    required: "La contraseña es requerida",
                                })}
                            />
                        </div>
                        {errors.password && <span className="error">{errors.password.message}</span>}
                    </div>

                    <div className="remember-me">
                        <input type="checkbox" id="remember-me" />
                        <span>Recuerdame</span>
                    </div>

                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>

                    <BotonLogin type="submit" className="btn btn-login">Iniciar sesión</BotonLogin>
                    <Link to="/registro" className="btn btn-register">Registrarse</Link>

                </form>
            </section>
        </>
    );
}

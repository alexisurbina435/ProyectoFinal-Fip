import "./perfilUsuario.css"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usuarioService from "../../services/usuario.service";
import TablaRutina from "../rutina/TablaRutina";
import Rutina from "../rutina/Rutina";
const sections = [
    { id: "nombre", title: "Modificar Nombre" },
    { id: "correo", title: "Modificar Correo" },
    { id: "password", title: "Modificar Contraseña" },
    { id: "telefono", title: "Modificar Teléfono" },
    { id: "direccion", title: "Modificar Dirección" },
    { id: "plan", title: "Modificar Plan" },
    { id: "planilla", title: "Mi planilla" },
    { id: "rutina", title: "Mis Rutinas" },
]
const beneficios = [
    { id: "premium", beneficios: ["Entrenadores Online libre", "Entrenamiento Progresivo", "Clase consulta ilimitadas", "Subscripción mensual", "Descuento en tienda 15%", "Entrenos one-one"] },
    { id: "standard", beneficios: ["Entrenadores Online libre", "Entrenamiento Progresivo", "Clase consulta limitadas", "Subscripcion mensual", "Descuento en tienda 10%", "3 entrenos diferentes"] },
    { id: "basic", beneficios: ["Entrenamiento online", "Entrenamiento progresivo", "Clase consulta limitadas", "Subscripcion mensual", "Descuento en tienda 5%", "Entrenos 2 veces"] }
];

const PerfilUsuario = () => {

    const [sectionActiva, setSectionActiva] = useState("nombre");

    const [data, setData] = useState([]);
    const getUsuario = async () => {
        const data = await usuarioService.getUsuarioById();
        setData(data);
    }

    useEffect(() => {
        getUsuario();
    }, []);

    return (


        <div className="profile-container">

            {/* Columna izquierda - Navegación */}
            <div className="profile-sidebar">
                <div className="profile-nav">
                    {sections
                        .filter((section) => {
                            // Si el usuario no cumple la validación, ocultamos direccion, plan, planilla y rutina
                            if (!data.estado_pago && ["direccion", "plan", "planilla", "rutina"].includes(section.id)) {
                                return false;
                            }
                            return true;
                        })
                        .map((section) => (
                            <button
                                key={section.id}
                                className={`profile-nav-item ${sectionActiva === section.id ? "active" : ""}`}
                                onClick={() => setSectionActiva(section.id)}
                            >
                                {section.title}
                            </button>
                        ))}

                </div>
            </div>

            {/* Columna derecha - Contenido*/}
            <div className="profile-content">
                {/* Sección Modificar Nombre*/}
                <div className={`profile-section ${sectionActiva === "nombre" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-user"></i>Modificar Nombre</h2>
                    <div className="profile-form">
                        <form id="profileForm">
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre Actual</label>
                                {data && data.nombre && data.apellido ? (
                                    <input type="text" id="nombre" placeholder={`${data.nombre} ${data.apellido}`} disabled={true} />
                                ) : (
                                    <input type="text" id="cargando" placeholder="Cargando..." disabled={true} />
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nuevoNombre">Nuevo Nombre</label>
                                <input type="text" id="nuevoNombre" placeholder="Ingrese su nombre completo" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Nuevo Apellido</label>
                                <input type="text" id="apellido" placeholder="Ingrese su nombre completo" required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                                <button type="button" className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>


                {/* Sección Modificar Correo */}
                <div className={`profile-section ${sectionActiva === "correo" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-envelope"></i> Modificar Correo</h2>
                    <div className="profile-form">
                        <form id="profileFormEmail">
                            <div className="form-group">
                                <label htmlFor="email">Correo Actual</label>
                                {data && data.email ? (
                                    <input type="email" id="email" placeholder={data.email} disabled={true} />
                                ) : (
                                    <input type="text" id="cargando" placeholder="Cargando..." disabled={true} />
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nuevoEmail">Correo Nuevo</label>
                                <input type="email" id="nuevoEmail" placeholder="Ingrese su nuevo correo" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmEmail">Confirmar Nuevo Correo</label>
                                <input type="email" id="confirmEmail" placeholder="Confirme su nuevo correo" required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                                <button type="button" className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sección Modificar Contraseña */}
                <div className={`profile-section ${sectionActiva === "password" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-lock"></i> Modificar Contraseña</h2>
                    <div className="profile-form">
                        <form id="profileFormPassword">
                            {/* <div className="form-group">
                                <label htmlFor="password">Contraseña Actual</label>
                                {data && data.password ? (
                                    
                                    <input type="password" id="password" placeholder={data.password} required />
                                ): (
                                    <input type="text" id="cargando" placeholder="Cargando..." disabled={true} />
                                )}
                            </div> */}

                            <div className="form-group">
                                <label htmlFor="nuevaPassword">Nueva Contraseña</label>
                                <input type="password" id="nuevaPassword" placeholder="Ingrese su nueva Contraseña" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                                <input type="password" id="confirmPassword" placeholder="Confirme su nueva Contraseña" required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                                <button type="button" className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sección Modificar Teléfono */}
                <div className={`profile-section ${sectionActiva === "telefono" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-phone"></i> Modificar Telefono</h2>
                    <div className="profile-form">
                        <form id="profileFormPhone">
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono Actual</label>
                                {data && data.telefono ? (
                                    <input type="phone" id="telefono" placeholder={data.telefono} disabled={true} />
                                ) : (
                                    <input type="text" id="cargando" placeholder="Cargando..." disabled={true} />
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nuevoTelefono">Nuevo Teléfono</label>
                                <input type="text" id="nuevoTelefono" placeholder="Ingrese su nombre completo" required />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                                <button type="button" className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/*Sección Modificar Dirección*/}
                <div className={`profile-section ${sectionActiva === "direccion" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-map-marker-alt"></i> Modificar Dirección</h2>
                    <div className="profile-form">
                        <form id="profileFormAddress">
                            <div className="form-group">
                                <label htmlFor="direccion">Dirección Actual</label>
                                {data && data.ficha?.direccion ? (
                                    <input type="text" id="direccion" placeholder={data.ficha?.direccion} disabled={true} />
                                ) : (
                                    <input type="text" id="cargando" placeholder="Cargando..." disabled={true} />
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="nuevaDireccion">Nueva Dirección</label>
                                <input type="text" id="nuevaDireccion" placeholder="Ingrese su nombre completo" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="ciudad">Ciudad</label>
                                <input type="text" id="ciudad" placeholder="Ingrese su nombre completo" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="codigoPostal">Código Postal</label>
                                <input type="text" id="codigoPostal" placeholder="Ingrese su nombre completo" required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-save">Guardar Cambios</button>
                                <button type="button" className="btn-cancel">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sección Modificar Plan*/}
                <div className={`profile-section ${sectionActiva === "plan" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-dumbbell"></i> Mi Plan</h2>
                    <div className="plan-info">
                        <div className="plan-card">
                            <div className="plan-header">
                                <h3 id="planNombre">Plan {data.plan?.nombre}</h3>
                                <span className="plan-status" id="planStatus">Activo</span>
                            </div>
                            <div className="plan-details">
                                <p><strong>Precio:</strong> <span id="planPrecio">${data.plan?.precio}</span></p>
                                <p><strong>Fecha de inicio:</strong> <span id="planFechaInicio">01/01/2025</span></p>
                                <p><strong>Próximo pago:</strong> <span id="planProximoPago">01/02/2025</span></p>
                                <p><strong>Estado:</strong> <span id="planEstado">Activo</span></p>
                            </div>
                            <div className="plan-benefits">
                                <h4>Beneficios de tu plan:</h4>
                                <ul className="lista-beneficios">
                                    {beneficios
                                        .find((bene) => bene.id === data.plan?.nombre)
                                        ?.beneficios.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                </ul>

                            </div>
                            <div className="plan-actions">
                                <button className="btn-save">Cambiar Plan</button>
                                <button className="btn-cancel">Cancelar Suscripción</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={`profile-section ${sectionActiva === "planilla" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-phone"></i> Modificar Telefono</h2>
                    <div className="profile-form">
                        <form id="profileFormPlanilla">
                            <div className="form-group">
                                <label htmlFor="planilla">Mi planilla de salud</label>
                                <Link className="btn-save btn-link" to="/planillaSalud">Planilla</Link>
                            </div>
                        </form>
                    </div>
                </div>

                <div className={`profile-section ${sectionActiva === "rutina" ? "profile-active" : ""}`}>
                    <Rutina />
                    <TablaRutina />
                </div>

            </div>
        </div>
    )
}
export default PerfilUsuario;
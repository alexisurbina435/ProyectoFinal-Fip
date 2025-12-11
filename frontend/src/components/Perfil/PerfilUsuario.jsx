import "./perfilUsuario.css"

import { Link, useLocation } from "react-router-dom";
import TablaRutina from "../rutina/TablaRutina";
import Rutina from "../rutina/Rutina";
import Planilla from "../planilla/Planilla";
import Swal from "sweetalert2";
import suscripcionService from "../../services/suscripcion.service";
// hook personalizado para useForm 
import { useEffect } from "react";
import { UseFormPerfil } from "../../hooks/useFormPerfil";
const sections = [
    { id: "nombre", title: "Modificar Nombre" },
    { id: "correo", title: "Modificar Correo" },
    { id: "password", title: "Modificar Contraseña" },
    { id: "telefono", title: "Modificar Teléfono" },
    { id: "plan", title: "Modificar Plan" },
    { id: "planilla", title: "Mi planilla" },
    { id: "rutina", title: "Mis Rutinas" },
]
const beneficios = [
    { id: "premium", beneficios: ["Entrenadores Online libre", "Entrenamiento Progresivo", "Clase consulta ilimitadas", "Subscripción mensual", "Entrenos one-one"] },
    { id: "standard", beneficios: ["Entrenadores Online libre", "Entrenamiento Progresivo", "Clase consulta limitadas", "Subscripcion mensual", "3 entrenos diferentes"] },
    { id: "basic", beneficios: ["Entrenamiento online", "Entrenamiento progresivo", "Clase consulta limitadas", "Subscripcion mensual", "Entrenos 2 veces"] }
];

const PerfilUsuario = () => {

    const {
        data, sectionActiva, setSectionActiva, formNombre, formEmail, formTelefono, formPassword,
        editarNombre, editarEmail, editarTelefono, onSubmitEmail, onSubmitNombre, onSubmitTelefono, onsubmitPassword } = UseFormPerfil();

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sectionParam = params.get("section");
        if (sectionParam) {
            setSectionActiva(sectionParam);
        }
    }, [location.search, setSectionActiva]);

    const cancelarSuscripcion = async (preapprovalId) => {
        Swal.fire({
            title: 'Cancelar Suscripcion',
            text: "¿Estás seguro de cancealr la suscripcion?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await suscripcionService.cancelar(preapprovalId);
                    console.log("Recibí preapprovalId:", preapprovalId);
                    Swal.fire(
                        'Cancelado!',
                        'La suscripcion ha sido canceladad.',
                        'success'
                    ).then(() => {

                        window.location.reload();
                    });
                } catch (error) {
                    Swal.fire(
                        'Error!',
                        'No se pudo cancelar la suscripcion.',
                        'error'
                    );
                }
            }
        });
    };
    const suscripcionActiva = data?.suscripciones?.find(s => s.estado === 'ACTIVA');
    const canceladas = data?.suscripciones?.filter(s => s.estado === 'CANCELADA');

    const ultimaCancelada = canceladas?.reduce((ultima, actual) => {
        if (!ultima) return actual;
        return new Date(actual.fechaInicio) > new Date(ultima.fechaInicio) ? actual : ultima;
    }, null);




    console.log(data);
    return (

        <div className="profile-container">

            {/* Columna izquierda - Navegación */}
            <div className="profile-sidebar">
                <div className="profile-nav">
                    {sections
                        .filter((section) => {
                            // Si el usuario no cumple la validación, ocultamos direccion, plan, planilla y rutina
                            if (!data.estado_pago && ["plan", "planilla", "rutina"].includes(section.id)) {
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
                        <form id="profileForm" onSubmit={onSubmitNombre}>
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
                                <input type="text" id="nuevoNombre" placeholder="Ingrese su nombre completo" {...formNombre.register("nombre", {
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
                            {formNombre.formState.errors.nombre && <span className="error">{formNombre.formState.errors.nombre.message}</span>}
                            <div className="form-group">
                                <label htmlFor="apellido">Nuevo Apellido</label>
                                <input type="text" id="apellido" placeholder="Ingrese su nombre completo"  {...formNombre.register("apellido", {
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
                            {formNombre.formState.errors.apellido && <span className="error">{formNombre.formState.errors.apellido.message}</span>}
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
                        <form id="profileFormEmail" onSubmit={onSubmitEmail}>
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
                                <input type="email" id="nuevoEmail" placeholder="Ingrese su nuevo correo" {...formEmail.register("email",
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

                            {formEmail.formState.errors.email && (<span className="error">{formEmail.formState.errors.email.message}</span>)}


                            <div className="form-group">
                                <label htmlFor="confirmEmail">Confirmar Nuevo Correo</label>
                                <input type="email" id="confirmEmail" placeholder="Confirme su nuevo correo" {...formEmail.register("confirmEmail",
                                    {
                                        required: {
                                            value: true,
                                            message: "El correo es requerido"
                                        },
                                        pattern: {
                                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                                            message: "El correo no es valido"
                                        },
                                        validate: (value) => {
                                            if (value === formEmail.watch('email')) {
                                                return true;
                                            } else {
                                                return "Los correos no coinciden";
                                            }
                                        }
                                    })} />
                            </div>
                            {formEmail.formState.errors.confirmEmail && (<span className="error">{formEmail.formState.errors.confirmEmail.message}</span>)}
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
                        <form id="profileFormPassword" onSubmit={onsubmitPassword}>
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
                                <input type="password" id="nuevaPassword" placeholder="Ingrese su nueva Contraseña" {...formPassword.register("password",
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
                            {formPassword.formState.errors.password && <span className="error">{formPassword.formState.errors.password.message}</span>}

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                                <input type="password" id="confirmPassword" placeholder="Confirme su nueva Contraseña" {...formPassword.register("confirmPassword",
                                    {
                                        required: {
                                            value: true,
                                            message: "Por favor confirme su contraseña"
                                        },
                                        validate: (value) => {
                                            if (value === formPassword.watch('password')) return true;
                                            return "Las contraseñas no coinciden"
                                        }

                                    })} />
                            </div>
                            {formPassword.formState.errors.password && <span className="error">{formPassword.formState.errors.password.message}</span>}
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
                        <form id="profileFormPhone" onSubmit={onSubmitTelefono}>
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
                                <input type="tel" id="nuevoTelefono" placeholder="Ingrese su nuevo Teléfono" {...formTelefono.register("telefono",
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
                                            value: /^(\+54\s?)?\d{3,4}\s?\d{6}$/,
                                            message: "El telefono no es valido"
                                        }
                                    }
                                )} />
                            </div>
                            {formTelefono.formState.errors.telefono && <span className="error">{formTelefono.formState.errors.telefono.message}</span>}

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
                                {suscripcionActiva ? (
                                    <>
                                        <h3 id="planNombre">Plan {suscripcionActiva.plan?.nombre}</h3>
                                        <span className="plan-status">Activo</span>
                                    </>
                                ) : ultimaCancelada ? (
                                    <>
                                        <h3 id="planNombre">Plan {ultimaCancelada.plan?.nombre}</h3>
                                        <span className="plan-status">Cancelado</span>
                                    </>
                                ) : (
                                    <>
                                        <h3 id="planNombre">Plan Gratis</h3>
                                        <span className="plan-status">Gratis</span>
                                    </>
                                )}
                            </div>

                            <div className="plan-details">
                                {suscripcionActiva ? (
                                    <>
                                        <p><strong>Precio:</strong> <span id="planPrecio">${suscripcionActiva.plan?.precio || 'Sin datos'}</span></p>
                                        <p><strong>Fecha de inicio:</strong> <span id="planFechaInicio">{suscripcionActiva.fechaInicio ? new Date(suscripcionActiva.fechaInicio).toLocaleDateString() : 'Sin datos'}</span></p>
                                        <p><strong>Próximo pago:</strong> <span id="planProximoPago">{suscripcionActiva.fechaFin ? new Date(suscripcionActiva.fechaFin).toLocaleDateString() : 'Sin datos'}</span></p>
                                        <p><strong>Estado:</strong> <span id="planEstado">{suscripcionActiva.estado || 'Sin datos'}</span></p>
                                        <p><strong>Total pagado:</strong> <span id="planPrecio">${suscripcionActiva.montoPagado || '0'}</span></p>
                                    </>
                                ) : ultimaCancelada ? (
                                    <>
                                        <p><strong>Precio:</strong> <span id="planPrecio">${ultimaCancelada.plan?.precio || 'Sin datos'}</span></p>
                                        <p><strong>Fecha de inicio:</strong> <span id="planFechaInicio">{ultimaCancelada.fechaInicio ? new Date(ultimaCancelada.fechaInicio).toLocaleDateString() : 'Sin datos'}</span></p>
                                        <p><strong>Fecha fin:</strong> <span id="planFechaFin">{ultimaCancelada.fechaFin ? new Date(ultimaCancelada.fechaFin).toLocaleDateString() : 'Sin datos'}</span></p>
                                        <p><strong>Estado:</strong> <span id="planEstado">{ultimaCancelada.estado || 'Cancelado'}</span></p>
                                        <p><strong>Total pagado:</strong> <span id="planPrecio">${ultimaCancelada.montoPagado || '0'}</span></p>
                                    </>
                                ) : (
                                    <p><strong>Plan:</strong> <span id="planPrecio">Gratis</span></p>
                                )}
                            </div>


                            <div className="plan-benefits">
                                <h4>Beneficios de tu plan:</h4>
                                <ul className="lista-beneficios">
                                    {suscripcionActiva ? (
                                        <>
                                            {beneficios
                                                .find((bene) => bene.id === suscripcionActiva.plan?.nombre)
                                                ?.beneficios.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                        </>
                                    ) : ultimaCancelada ? (
                                        <>
                                            {beneficios
                                                .find((bene) => bene.id === ultimaCancelada.plan?.nombre)
                                                ?.beneficios.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                        </>
                                    ) : (
                                        <p><strong>Plan:</strong> <span id="planPrecio">Gratis</span></p>
                                    )}
                                </ul>


                            </div>
                            <div className="plan-actions">
                                <Link className="btn-save" to="/inscribite">Cambiar plan</Link>
                                {suscripcionActiva ? <button
                                    className="btn-cancel"
                                    onClick={() => cancelarSuscripcion(suscripcionActiva.preapprovalId)}>Cancelar Suscripción</button> :
                                    <button className="btn-cancel">Cancelar Suscripción</button>}
                            </div>
                        </div>
                    </div>
                </div>


                <div className={`profile-section ${sectionActiva === "planilla" ? "profile-active" : ""}`}>
                    <h2><i className="fas fa-clipboard"></i> Mi Planilla</h2>
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
                    <TablaRutina />
                </div>

            </div>
        </div>
    )
}
export default PerfilUsuario;
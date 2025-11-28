import './planillaSalud.css'
import { useForm } from "react-hook-form";

import Textarea from '../textarea/Textarea'
import InputRadio from '../inputRadio/InputRadio'
import LabelRadio from '../labelRadio/LabelRadio';
import LabelPlanilla from '../labelPlanilla/LabelPlanilla';
import InputPlanilla from '../inputPlanillaSalud/InputPlanilla';
import BotonForm from "../botonForm/BotonForm";
import BannerImg from "../../assets/images/fondo-mejorado.png"
// import Modal from "../modal/Modal";
import { useEffect, useState } from 'react';
import FichaSaludService from '../../services/fichaSalud.service';
import usuarioService from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
export default function Planilla() {

    const navigate = useNavigate ();

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

    const [data, setData] = useState([]);
    const [usuario, setUsuario] = useState([]);

    const fetchPlanilla = async () => {
        try {
            const usuario = await usuarioService.getUsuarioById();
            // const planilla = await FichaSaludService.getFichaSaludById();
            setUsuario(usuario.ficha);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchPlanilla();
        console.log(usuario);
    }, [])

    const enviarPlanilla = async (fichaSaludData) => {
        try {
            const usuario = await usuarioService.getUsuarioById();
            const ficha = {
                ...fichaSaludData,
                id_usuario: usuario.id_usuario,
            }
            console.log(ficha);

            const postPlanilla = await FichaSaludService.createFichaSalud(ficha);

            setData(postPlanilla);
            Swal.fire({
                title: 'Formulario completado!',
                text: 'Tu planilla ha sido enviada correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                reset();
                navigate('/perfil');
            });
        } catch (error) {
            console.log(error);
        }

    }

    const onSubmit = handleSubmit(async (data) => {
        enviarPlanilla(data)
        // favDialog.showModal();
    })


    return (
        <>
            <div className="form-container">
                <div className="conten-fondo">
                    <img src={BannerImg} alt="banner gimnasio" className="fondo" />
                </div>
                <div className="title">
                    <h2>Planilla de salud</h2>
                </div>
                <form action="" className="formulario" id="formulario" onSubmit={onSubmit}>
                    <fieldset className="datos-personales">
                        <legend>Datos Personales</legend>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="dni" children="DNI" />
                            <div className="inputs">
                                {usuario?.dni ? <InputPlanilla type="number" min="0" id="dni" defaultValue={usuario.dni} disabled /> : 
                                <InputPlanilla type="number" min="0" id="dni" placeholder="Dni" {...register("dni", {
                                    required: {
                                        value: true,
                                        message: "El DNI es obligatorio"
                                    },
                                    minLength: {
                                        value: 7,
                                        message: "El DNI debe tener al menos 7 caracteres"
                                    },
                                    maxLength: {
                                        value: 8,
                                        message: "El DNI debe tener máximo 8 caracteres"
                                    },
                                    pattern: {
                                        value: /^[0-9]+$/i,
                                        message: "El DNI solo puede contener numeros"
                                    }
                                })} />
                                }
                            </div>
                            {errors.dni && <span className="error">{errors.dni.message}</span>}
                        </div>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="fechaNacimiento" children="Fecha de nacimiento" />
                            <div className="inputs">
                                {usuario?.fechaNacimiento ? <InputPlanilla type="date" id="fechaNacimiento" defaultValue={usuario.fechaNacimiento} disabled /> :
                                <InputPlanilla type="date" id="fechaNacimiento" {...register("fechaNacimiento", {
                                    required: {
                                        value: true,
                                        message: "La fecha de nacimiento es obligatoria"
                                    }, min: {
                                        value: "1920-01-01",
                                        message: "La fecha de nacimiento debe ser posterior a 1920-01-01"
                                    },
                                    // max: {
                                    //     value: "2018-01-01",
                                    //     message: "La fecha de nacimiento debe ser anterior a 2018-01-01"
                                    // }

                                })} />}
                            </div>
                            {errors.fechaNacimiento && <span className="error">{errors.fechaNacimiento.message}</span>}
                        </div>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="direccion" children="Dirección" />
                            <div className="inputs">
                                {usuario?.direccion ? <InputPlanilla type="text" id="direccion" defaultValue={usuario.direccion} disabled /> :
                                <InputPlanilla type="text" id="direccion" placeholder="Dirección" {...register("direccion",
                                    {
                                        required: {
                                            value: true,
                                            message: "La direccion es obligatoria"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "La direccion debe tener al menos 3 caracteres"
                                        },
                                    })} />}
                            </div>
                            {errors.direccion && <span className="error">{errors.direccion.message}</span>}
                        </div>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="ciudad" children="Ciudad" />
                            <div className="inputs">
                                {usuario?.ciudad ? <InputPlanilla type="text" id="ciudad" defaultValue={usuario.ciudad} disabled /> :
                                <InputPlanilla type="text" id="ciudad" placeholder="Ciudad" {...register("ciudad",
                                    {
                                        required: {
                                            value: true,
                                            message: "La ciudad es obligatoria"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "La ciudad debe tener al menos 3 caracteres"
                                        },
                                    })} />}
                            </div>
                            {errors.ciudad && <span className="error">{errors.ciudad.message}</span>}
                        </div>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="provincia" children="Provincia" />
                            <div className="inputs">
                                {usuario?.provincia ? <InputPlanilla type="text" id="provincia" defaultValue={usuario.provincia} disabled /> :
                                <InputPlanilla type="text" id="provincia" placeholder="Provincia" {...register("provincia",
                                    {
                                        required: {
                                            value: true,
                                            message: "La provincia es obligatoria"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "La provincia debe tener al menos 3 caracteres"
                                        },
                                    })} />}
                            </div>
                            {errors.provincia && <span className="error">{errors.provincia.message}</span>}
                        </div>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="codigoPostal" children="Código Postal" />
                            <div className="inputs">
                                {usuario?.codigoPostal ? <InputPlanilla type="number" id="codigoPostal" defaultValue={usuario.codigoPostal} disabled /> :
                                <InputPlanilla type="number" min="0" id="codigoPostal" placeholder="Codigo Postal" {...register("codigoPostal",
                                    {
                                        required: {
                                            value: true,
                                            message: "El código postal es obligatorio"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "El código postal debe tener al menos 3 caracteres"
                                        },
                                        maxLength: {
                                            value: 6,
                                            message: "El código postal debe tener maximo 6 caracteres"
                                        },
                                    })} />}
                            </div>
                            {errors.codigoPostal && <span className="error">{errors.codigoPostal.message}</span>}
                        </div>

                        <div className="input-container">
                            <LabelPlanilla htmlFor="pais" children="País" />
                            <div className="inputs">
                                {usuario?.pais ? <InputPlanilla type="text" id="pais" defaultValue={usuario.pais} disabled /> :
                                <InputPlanilla type="text" id="pais" placeholder="País" {...register("pais",
                                    {
                                        required: {
                                            value: true,
                                            message: "El pais es obligatorio"
                                        },
                                        minLength: {
                                            value: 3,
                                            message: "El pais debe tener al menos 3 caracteres"
                                        },
                                    })} />}
                            </div>
                            {errors.pais && <span className="error">{errors.pais.message}</span>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="sexo">Sexo</label>
                            {usuario?.sexo ? <select id="sexo" className="form-input" disabled><option value={usuario.sexo}>{usuario.sexo}</option></select> :
                            <select id="sexo" className="form-input" {...register("sexo")}>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                                <option value="otro">Sin especificar</option>
                            </select>}
                        </div>

                        <div className="input-container">
                            <label htmlFor="clase">Tipo de clases</label>
                            {usuario?.clase ? <select id="clase" className="form-input" disabled><option value={usuario.clase}>{usuario.clase}</option></select> :
                            <select id="clase" className="form-input" {...register("clase")}>
                                <option value="presencial">Presencial</option>
                                <option value="online">Online</option>
                                <option value="mixto">Mixto</option>
                            </select>}
                        </div>


                    </fieldset>

                    <fieldset className='informacion'>
                        <legend>Información importante</legend>
                        <div className="check-contenedor">
                            <div className='contenedor-checkboxs'>
                                <div className="checkboxs">
                                    <LabelRadio htmlFor="condicion" children="¿PADECE ALGUNA CONDICIÓN MEDICA?" />
                                    {usuario?.condicion ? <InputRadio value="si" id="si-condicion" checked={usuario.condicion === "si"} />:
                                    <InputRadio value="si" id="si-condicion" {...register("condicion",
                                        {
                                            required: "Debe seleccionar una opción",
                                            setValueAs: (v) => v === "si"

                                        }
                                    )} />}SI
                                    {usuario?.condicion ? <InputRadio value="no" id="no-condicion" checked={usuario.condicion === "no"} />:
                                    <InputRadio value="no" id="no-condicion"  {...register("condicion",
                                        {
                                            required: "Debe seleccionar una opción",
                                            setValueAs: (v) => v === "si"

                                        }
                                    )} />}NO
                                </div>
                                {errors.condicion && <span className="error">{errors.condicion.message}</span>}
                            </div>
                            <div className="input-contenedor">
                                <LabelPlanilla htmlFor="lesion" children="SI ES AFIRMATIVO ESPECIFIQUE:" />
                                <div className="textarea-form">
                                    {usuario?.lesion ? <Textarea id="lesion" defaultValue={usuario.lesion} disabled />:
                                    <Textarea id="lesion" placeholder="Especifique la condicion" disabled={watch("condicion") === "no"} {...register("lesion",
                                        {
                                            validate: () => {
                                                if (watch("condicion") === "si" && watch("lesion") === "") {
                                                    return "Campo requerido"
                                                }
                                                if (watch("condicion") === "si" && watch("lesion").length < 10) {
                                                    return "Debe tener al menos 10 caracteres"

                                                }
                                            },


                                        }
                                    )} />}
                                </div>
                                {errors.lesion && <span className="error">{errors.lesion.message}</span>}
                            </div>
                        </div>

                        <div className="check-contenedor">
                            <div className='contenedor-checkboxs'>
                                <div className="checkboxs">
                                    <LabelRadio htmlFor="medicacion" children="¿ESTA TOMANDO ALGUNA MEDICACIÓN?" />
                                    {usuario?.medicacion ? <InputRadio value="si" id="si-medicacion" checked={usuario.medicacion === "si"} /> :
                                    <InputRadio value="si" id="si-medicacion" {...register("medicacion",
                                        {
                                            required: "Debe seleccionar una opción",
                                            setValueAs: (v) => v === "si"
                                        }
                                    )} />}SI
                                    {usuario?.medicacion ? <InputRadio value="no" id="no-medicacion" checked={usuario.medicacion === "no"} /> :
                                    <InputRadio value="no" id="no-medicacion" {...register("medicacion",
                                        {
                                            required: "Debe seleccionar una opción",
                                            setValueAs: (v) => v === "si"
                                        }
                                    )} />}NO
                                </div>
                                {errors.medicacion && <span className="error">{errors.medicacion.message}</span>}
                            </div>
                            <div className="input-contenedor">
                                <LabelPlanilla htmlFor="medicamento" children="SI ES AFIRMATIVO ESPECIFIQUE:" />
                                <div className="textarea-form">
                                    {usuario?.medicamento ? <Textarea id="medicamento" defaultValue={usuario.medicamento} disabled />:
                                    <Textarea id="medicamento" placeholder="Especifique la condicion: " disabled={watch("medicacion") === "no"} {...register("medicamento",
                                        {
                                            validate: () => {
                                                if (watch("medicacion") === "si" && watch("medicamento") === "") {
                                                    return "Campo requerido"
                                                }
                                                if (watch("medicacion") === "si" && watch("medicamento").length < 10) {
                                                    return "Debe tener al menos 10 caracteres"

                                                }
                                            },
                                        }
                                    )} />}
                                </div>
                                {errors.medicamento && <span className="error">{errors.medicamento.message}</span>}
                            </div>
                        </div>

                        <div className="check-contenedor">
                            <div className='contenedor-checkboxs'>
                                <div className="checkboxs">
                                    <LabelRadio htmlFor="experiencia" children="¿TIENE EXPERIENCIA ENTRENANDO?" />
                                    {usuario?.expEntrenando ? <InputRadio value="si" id="si-entreno" checked={usuario.expEntrenando === "si"} /> :
                                    <InputRadio value="si" id="si-entreno" {...register("expEntrenando",
                                        {
                                            required: "Debe seleccionar una opción",
                                            setValueAs: (v) => v === "si"
                                        }
                                    )} />}SI
                                    {usuario?.expEntrenando ? <InputRadio value="no" id="no-entreno" checked={usuario.expEntrenando === "no"} /> :
                                    <InputRadio value="no" id="no-entreno" {...register("expEntrenando",
                                        {
                                            required: "Debe seleccionar una opción",
                                            setValueAs: (v) => v === "si"
                                        }
                                    )} />}NO
                                </div>
                                {errors.expEntrenando && <span className="error">{errors.expEntrenando.message}</span>}
                            </div>
                            <div className="input-contenedor">
                                <LabelPlanilla htmlFor="objetivo" children="OBJETIVOS:" />
                                <div className="textarea-form">
                                    {usuario?.objetivos ? <Textarea id="objetivo" defaultValue={usuario.objetivos} disabled />:
                                    <Textarea id="objetivo" placeholder="Objetivos" {...register("objetivos",
                                        {
                                            required: {
                                                value: true,
                                                message: "Campo requerido"
                                            },
                                            minLength: {
                                                value: 10,
                                                message: "Debe tener al menos 10 caracteres"
                                            }
                                        }
                                    )} />}
                                </div>
                                {errors.objetivos && <span className="error">{errors.objetivos.message}</span>}
                            </div>
                        </div>

                    </fieldset>
                    <BotonForm type="submit" id="showPopup"  >Enviar</BotonForm>
                </form>
                {/* <Modal mensaje="Planilla enviada" /> */}
            </div>
        </>
    )
}
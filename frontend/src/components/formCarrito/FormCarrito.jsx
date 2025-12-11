import './formCarrito.css';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
const FormCarrito = () => {

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    reset();
  })
  return (
    <form className="form-carrito" onSubmit={onSubmit}>
      <h2>DIRECCIÓN DE ENVÍO</h2>

      <div className="form-row">
        <label>
          Nombre completo:
          <input type="text" placeholder="Ej. Juan Pérez" {...register('nombre',{
            required:{
              value: true,
              message: 'El nombre es requerido'
            },
            minLength: {
              value: 3,
              message: 'El nombre debe tener al menos 3 caracteres'
            },
            maxLength: {
              value: 30,
              message: 'El nombre debe tener menos de 30 caracteres'
            }
          })} />
          {errors.nombre && <span className="error">{errors.nombre.message}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Calle:
          <input type="text" placeholder="Ej. Av. Rivadavia" {...register('calle',{
            required:{
              value: true,
              message: 'La calle es requerida'
            },
            minLength: {
              value: 3,
              message: 'La calle debe tener al menos 3 caracteres'
            },
            maxLength: {
              value: 30,
              message: 'La calle debe tener menos de 30 caracteres'
            }
          })} />
          {errors.calle && <span className="error">{errors.calle.message}</span>}
        </label>
        <label>
          Altura:
          <input type="number" min={0}  placeholder="Ej. 1234" {...register('altura',{
            required:{
              value: true,
              message: 'La altura es requerida'
            },
            minLength: {
              value: 3,
              message: 'La altura debe tener al menos 3 caracteres'
            },
            maxLength: {
              value: 10,
              message: 'La altura debe tener menos de 4 caracteres'
            }
          })} />
          {errors.altura && <span className="error">{errors.altura.message}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Piso:
          <input type="text" placeholder="Ej. 2" />
        </label>
        <label>
          Departamento:
          <input type="text"  placeholder="Ej. B" />
        </label>
      </div>

      <div className="form-row">
        <label>
          Código Postal:
          <input type="number" min={0} placeholder="Ej. 7400" {...register('codigoPostal',{
            required:{
              value: true,
              message: 'El codigo postal es requerido'
            },
            minLength: {
              value: 3,
              message: 'El codigo postal debe tener al menos 4 caracteres'
            },
            maxLength: {
              value: 4,
              message: 'El codigo postal debe tener menos de 4 caracteres'
            }
          })} />
          {errors.codigoPostal && <span className='error'>{errors.codigoPostal.message}</span>}
        </label>
        <label>
          Localidad:
          <input type="text"  placeholder="Ej. Olavarría" {...register('localidad',{
            required:{
              value: true,
              message: 'La localidad es requerida'
            },
            minLength: {
              value: 3,
              message: 'La localidad debe tener al menos 3 caracteres'
            },
            maxLength: {
              value: 30,
              message: 'La localidad debe tener menos de 30 caracteres'
            }
          })} />
          {errors.localidad && <span className='error'>{errors.localidad.message}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Provincia:
          <input type="text"  placeholder="Ej. Buenos Aires" {...register("provincia",{
            required:{
              value: true,
              message: 'La provincia es requerida'
            },
            minLength: {
              value: 3,
              message: 'La provincia debe tener al menos 3 caracteres'
            },
            maxLength: {
              value: 30,
              message: 'La provincia debe tener menos de 30 caracteres'
            }
          })} />
        {errors.provincia && <span className='error'>{errors.provincia.message}</span>}
        </label>
      </div>

      <div className="form-row">
        <label>
          Observaciones:
          <textarea  placeholder="Ej. Timbre roto, portón verde" {...register("observaciones")} />
        </label>
      </div>
      <button type='submit' className='boton-formCarrito'>Guardar datos</button>
    </form>
  );
};

export default FormCarrito;

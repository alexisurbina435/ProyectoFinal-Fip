import "./Perfil.css"

const Perfil = () => {
  
    return (
      <section className="admin-content">
        <div className="container">
          <h1 className="admin-title">Perfil de Administrador</h1>

          <div className="profile-form">
            <form id="profileForm">
              <div className="form-group">
                <label for="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" placeholder="Ingrese su nombre completo" required />
              </div>

              <div className="form-group">
                <label for="correo">Correo electrónico</label>
                <input type="email" id="correo" name="correo" placeholder="Ingrese su correo electrónico" required />
              </div>

              <div className="form-group">
                <label for="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" placeholder="Ingrese su número de teléfono" required />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">Guardar Cambios</button>
                <button type="button" className="btn-cancel" onClick={() => window.location.href='/admin'}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    );
};

export default Perfil;

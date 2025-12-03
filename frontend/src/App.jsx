import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Index from './pages/index/Index.jsx';
import Contacto from './pages/contacto/Contacto.jsx';
import SeccionBlog from './pages/pageBlog/SeccionBlog.jsx';
import Productos from './pages/productos/Productos.jsx';
import ContenidoDetalladoBlog from './pages/pageBlog/ContenidoDetalladoBlog.jsx';
import Admin from './pages/admin/Admin.jsx';
import AdminClientes from './pages/admin/AdminClientes.jsx';
import AdminRutinas from './pages/admin/AdminRutinas.jsx';
import AdminEjercicios from './pages/admin/AdminEjercicios.jsx';
import AdminTienda from './pages/admin/AdminTienda.jsx';

import Inscribite from './pages/inscripcion/Inscribite.jsx';
import CompraDirecta from './pages/compraDirecta/CompraDirecta.jsx';
import Carrito from './pages/carrito/Carrito.jsx';
import AdminContacto from './pages/admin/AdminContacto.jsx';
import PlanillaSalud from './pages/planillaSalud/PlanillaSalud.jsx';
import Registro from './pages/registro/Registro.jsx';
import Login from './pages/login/Login.jsx';
import SeccionPlanes from './pages/inscripcionDetalle/SeleccionPlan.jsx';
import Perfil from './pages/perfil/Perfil.jsx';

import ProtectedRoute from './components/protectedRoutes/ProtectRoute.jsx';
import PublicRoute from './components/publicRoute/PublicRoute.jsx';

import { useAuth } from "./context/AuthProvider.jsx";

export default function App() {

  const { user } = useAuth();

  const router = createBrowserRouter([
    { path: '/', element: (<Layout><Index /></Layout>), },
    { path: '/productos', element: (<Layout><Productos /></Layout>), },
    { path: '/blog', element: (<Layout><SeccionBlog /></Layout>), },
    { path: '/blog/:id', element: (<Layout><ContenidoDetalladoBlog /></Layout>), },
    { path: '/carrito', element: (<Layout><Carrito /></Layout>), },
    { path: '/contacto', element: (<Layout><Contacto /></Layout>), },
    { path: '/compraDirecta', element: (<Layout><CompraDirecta /></Layout>), },
    { path: '/inscribite', element: (<Layout><Inscribite /></Layout>), },
    { path: '/inscripciondetalle', element: (<Layout><SeccionPlanes /></Layout>), },
    { path: '/success', element: (<Layout><h1>Pago aprobado</h1></Layout>) },
    { path: '/failure', element: (<Layout><h1>Pago fallido</h1></Layout>) },
    { path: '/pending', element: (<Layout><h1>Pago pendiente</h1></Layout>) },
  
    {
      // si el usuario no existe o no es admin no deja entrar a paginas admin 
      element: <ProtectedRoute user={user} condition={(usuario) => usuario && (usuario.rol === 'admin')} />,
      children: [
        { path: '/admin', element: (<Layout><Admin /></Layout>), },
        { path: '/administrar-clientes', element: (<Layout><AdminClientes /></Layout>), },
        { path: '/administrar-rutinas', element: (<Layout><AdminRutinas /></Layout>), },
        { path: '/administrar-ejercicios', element: (<Layout><AdminEjercicios /></Layout>), },
        { path: '/administrar-tienda', element: (<Layout><AdminTienda /></Layout>), },
        { path: '/adminContacto', element: (<Layout><AdminContacto /></Layout>), },
      ],
    },
    {
      // si no existe usuario, o si rol no es admin o usuario no deja entrar a paginas de perfil
      element: <ProtectedRoute user={user} condition={(usuario) => usuario && (usuario.rol === 'usuario' || usuario.rol === 'admin')} />,
      children: [
        { path: '/perfil', element: (<Layout><Perfil /></Layout>), },
      ]
    },
    {
      // si existe usuario no deja entrar a login ni a registro 
      element: <PublicRoute user={user} redirectTo='/' />,
      children: [
        { path: '/registro', element: (<Layout><Registro /></Layout>), },
        { path: '/login', element: (<Layout><Login /></Layout>), },
      ],
    },
    {
      element: <ProtectedRoute user={user} condition={(usuario) => usuario && (usuario.rol === 'usuario') && (usuario.estado_pago === true)} />,
      children: [
        { path: '/planillaSalud', element: (<Layout><PlanillaSalud /></Layout>), },
      ]
    },
  ]);

  return <RouterProvider router={router} />;
}

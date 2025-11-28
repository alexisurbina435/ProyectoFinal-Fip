import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { CarritoProvider } from './components/carrito/CarritoContext.jsx';

initMercadoPago(import.meta.env.VITE_PUBLIC_KEY);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <CarritoProvider>
        <App></App>
      </CarritoProvider>
    </AuthProvider>

  </StrictMode>
);

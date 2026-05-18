import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './components/app/App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/authContext/AuthContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider >
    <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

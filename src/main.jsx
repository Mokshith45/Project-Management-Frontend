import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { UserProvider } from './pages/userPages/UserContext';
/* Make sure all imports use the correct casing for 'userPages' */
createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>
)

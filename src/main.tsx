import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import CountPage from './pages/CountPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <CountPage/>
  </StrictMode>,
)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthGuard from './components/AuthGuard'; // Vérifiez cette ligne

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthGuard> {/* L'AuthGuard doit entourer App */}
      <App />
    </AuthGuard>
  </React.StrictMode>
);

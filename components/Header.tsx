import React from 'react';
import { Settings } from 'lucide-react';

// --- AJOUT IMPORTANT ---
// On importe l'image. ".." signifie "remonter d'un dossier" pour aller dans src
import logoImage from '../logo.png'; 

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white shadow-lg print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO ET TITRE */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-1 rounded-full h-12 w-12 flex items-center justify-center">
              
              {/* --- MODIFICATION ICI --- */}
              {/* On utilise la variable importée (logoImage) au lieu du texte "/logo.png" */}
              <img 
                src={logoImage} 
                alt="Logo Club" 
                className="h-10 w-10 object-contain" 
              />
              
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                PHENIX
              </h1>
              <p className="text-xs text-gray-300 font-medium uppercase tracking-wider">
                Ton coach assistant en prépa physique
              </p>
            </div>
          </div>

          {/* Reste du code inchangé... */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-300 hover:text-white transition-colors">
              <Settings className="w-6 h-6" />
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;

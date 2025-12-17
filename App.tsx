
import React from 'react';
import DSKY from './components/DSKY';

const App: React.FC = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#121212] overflow-hidden p-2 sm:p-4">
      {/* Small Header to save vertical space */}
      <header className="mb-2 text-center shrink-0">
        <h1 className="text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">Block II AGC DSKY</h1>
      </header>
      
      <main className="flex-grow flex items-center justify-center w-full max-h-full overflow-hidden">
        <DSKY />
      </main>

      <footer className="mt-2 text-gray-700 font-mono text-[8px] uppercase text-center shrink-0 opacity-50">
        NASA MSC - Raytheon / MIT Simulation
      </footer>
    </div>
  );
};

export default App;

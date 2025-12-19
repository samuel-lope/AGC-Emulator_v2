
import React from 'react';
import { VERB_DICT, NOUN_DICT } from '../utils/commands';

const MissionControl: React.FC = () => {
  return (
    <div className="flex-1 w-full bg-[#0a0a0a] p-5 rounded-xl border border-[#222] font-mono shadow-inner overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-2">
        <h3 className="text-amber-500 font-bold uppercase tracking-widest text-xs">Mission Logs & AGC Docs</h3>
        <div className="flex gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[9px] text-green-500">REALTIME TELEMETRY</span>
        </div>
      </div>

      <div className="space-y-5">
        <section>
          <h4 className="text-gray-400 text-[10px] uppercase mb-2 border-l-2 border-amber-500 pl-2">System Operations</h4>
          <p className="text-gray-500 text-[11px] leading-relaxed mb-3">
            Press <span className="text-gray-300">VERB</span> + (2 digits) → <span className="text-gray-300">NOUN</span> + (2 digits) → <span className="text-gray-300">ENTR</span>.
          </p>
          <div className="bg-[#111] p-3 rounded text-[10px] text-amber-200/60 border border-white/5">
            <span className="block mb-1 text-amber-600 font-bold uppercase">Standard Procedures:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>V 35 ENTR : Master Lamp Test</li>
              <li>V 16 N 36 ENTR : AGC Internal Clock</li>
              <li>V 37 N 11 ENTR : Select P11 (Orbit)</li>
              <li>V 37 N 63 ENTR : Select P63 (Landing)</li>
              <li>Press <span className="text-amber-500 font-bold">PROC</span> to execute the selected Pxx</li>
            </ul>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          <section>
            <h4 className="text-gray-400 text-[10px] uppercase mb-2 border-l-2 border-amber-500 pl-2">Verbs</h4>
            <div className="space-y-1.5">
              {Object.entries(VERB_DICT).map(([code, desc]) => (
                <div key={code} className="flex flex-col text-[10px] border-b border-white/5 pb-1">
                  <span className="text-amber-500 font-bold">V{code}</span>
                  <span className="text-gray-500 truncate">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-gray-400 text-[10px] uppercase mb-2 border-l-2 border-amber-500 pl-2">Nouns</h4>
            <div className="space-y-1.5">
              {Object.entries(NOUN_DICT).map(([code, desc]) => (
                <div key={code} className="flex flex-col text-[10px] border-b border-white/5 pb-1">
                  <span className="text-amber-500 font-bold">N{code}</span>
                  <span className="text-gray-500 truncate">{desc}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-4 pt-4 border-t border-[#222] text-center">
          <p className="text-[8px] text-gray-600 uppercase leading-normal">
            Acknowledge: This is a digital twin of the Apollo Guidance Computer. 
            <br />
            Mission Critical Software v2.5.0
          </p>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}</style>
    </div>
  );
};

export default MissionControl;

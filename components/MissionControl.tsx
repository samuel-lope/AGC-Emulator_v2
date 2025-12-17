
import React from 'react';
import { VERB_DICT, NOUN_DICT } from '../utils/commands';

const MissionControl: React.FC = () => {
  return (
    <div className="flex-1 w-full bg-[#1a1a1a] p-6 rounded-xl border border-[#333] font-mono shadow-2xl overflow-y-auto max-h-[800px]">
      <div className="flex items-center justify-between mb-6 border-b border-[#333] pb-2">
        <h3 className="text-amber-500 font-bold uppercase tracking-widest text-sm">Mission Logs & Docs</h3>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-green-500">AGC ONLINE</span>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h4 className="text-gray-400 text-xs uppercase mb-3 border-l-2 border-amber-500 pl-2">Instructional Data</h4>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            To operate the DSKY, press <span className="text-gray-300">VERB</span> then two digits, then <span className="text-gray-300">NOUN</span> then two digits. Press <span className="text-gray-300">ENTR</span> to execute.
          </p>
          <div className="bg-black/50 p-3 rounded text-[11px] text-amber-200/70 border border-amber-900/30">
            <span className="block mb-1 text-amber-500 font-bold uppercase">Try these sequences:</span>
            <ul className="list-disc list-inside space-y-1">
              <li>VERB 35 ENTR: Lamp Test</li>
              <li>VERB 16 NOUN 36 ENTR: Real-time Clock</li>
              <li>VERB 37 ENTR: Request Program Change</li>
            </ul>
          </div>
        </section>

        <section>
          <h4 className="text-gray-400 text-xs uppercase mb-3 border-l-2 border-amber-500 pl-2">Verb Dictionary</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(VERB_DICT).map(([code, desc]) => (
              <div key={code} className="flex justify-between text-[11px] border-b border-white/5 pb-1">
                <span className="text-amber-500 font-bold">V{code}</span>
                <span className="text-gray-400">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-gray-400 text-xs uppercase mb-3 border-l-2 border-amber-500 pl-2">Noun Dictionary</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(NOUN_DICT).map(([code, desc]) => (
              <div key={code} className="flex justify-between text-[11px] border-b border-white/5 pb-1">
                <span className="text-amber-500 font-bold">N{code}</span>
                <span className="text-gray-400">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-[#333] text-center">
          <p className="text-[9px] text-gray-600 uppercase">
            Caution: High Voltage Electroluminescent Displays
            <br />
            Handle with Grounding Wrist Strap
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionControl;

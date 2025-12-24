
import React, { useState } from 'react';
import { VERB_DICT, NOUN_DICT } from '../utils/commands';
import { FunctionKeyConfig } from '../types';
import { STATUS_LABELS } from '../constants';

interface MissionControlProps {
  onConnectSerial?: () => void;
  isSerialConnected?: boolean;
  functionKeys?: Record<string, FunctionKeyConfig>;
  onUpdateFunctionKeys?: (newKeys: Record<string, FunctionKeyConfig>) => void;
}

const MissionControl: React.FC<MissionControlProps> = ({ 
  onConnectSerial, 
  isSerialConnected = false,
  functionKeys = {},
  onUpdateFunctionKeys
}) => {
  const [activeTab, setActiveTab] = useState<'DOCS' | 'PROGRAMMER'>('DOCS');
  const [editingKey, setEditingKey] = useState<string>('F1');

  // Helper para atualizar o objeto de configuração
  const handleConfigChange = (field: keyof FunctionKeyConfig, value: any) => {
    if (!onUpdateFunctionKeys) return;
    const currentConfig = functionKeys[editingKey];
    onUpdateFunctionKeys({
      ...functionKeys,
      [editingKey]: { ...currentConfig, [field]: value }
    });
  };

  // Helper para atualizar status flags
  const handleStatusChange = (statusKey: string) => {
    if (!onUpdateFunctionKeys) return;
    const currentConfig = functionKeys[editingKey];
    const newStatus = { 
      ...currentConfig.status, 
      [statusKey]: !currentConfig.status[statusKey as keyof typeof currentConfig.status] 
    };
    onUpdateFunctionKeys({
      ...functionKeys,
      [editingKey]: { ...currentConfig, status: newStatus }
    });
  };

  const currentConfig = functionKeys[editingKey];

  return (
    <div className="flex-1 w-full bg-[#0a0a0a] p-5 rounded-xl border border-[#222] font-mono shadow-inner overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-[#222] pb-2 shrink-0">
        
        {/* Navigation Tabs */}
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('DOCS')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${activeTab === 'DOCS' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-600 hover:text-gray-400'}`}
          >
            Mission Logs
          </button>
          <button 
            onClick={() => setActiveTab('PROGRAMMER')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${activeTab === 'PROGRAMMER' ? 'text-amber-500 border-b-2 border-amber-500' : 'text-gray-600 hover:text-gray-400'}`}
          >
            Programmer
          </button>
        </div>
        
        {/* Serial Connection Indicator/Button */}
        <button 
          onClick={onConnectSerial}
          disabled={isSerialConnected}
          className={`
            flex items-center gap-2 px-3 py-1 rounded border transition-all duration-200
            ${isSerialConnected 
              ? 'bg-[#1a2e1a] border-[#2f4] cursor-default' 
              : 'bg-[#1a1a1a] border-[#444] hover:bg-[#222] hover:border-amber-500 cursor-pointer active:translate-y-0.5'
            }
          `}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isSerialConnected ? 'bg-[#39ff14] shadow-[0_0_8px_#39ff14]' : 'bg-red-500/50'}`}></div>
          <span className={`text-[9px] font-bold tracking-wider ${isSerialConnected ? 'text-[#39ff14]' : 'text-gray-400'}`}>
            {isSerialConnected ? 'LINK ACTIVE' : 'CONNECT TELEMETRY'}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        
        {/* VIEW: DOCS & LOGS */}
        {activeTab === 'DOCS' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <section>
              <h4 className="text-gray-400 text-[10px] uppercase mb-2 border-l-2 border-amber-500 pl-2">System Operations</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed mb-3">
                Press <span className="text-gray-300">VERB</span> + (2 digits) → <span className="text-gray-300">NOUN</span> + (2 digits) → <span className="text-gray-300">ENTR</span>.
              </p>
              <div className="bg-[#111] p-3 rounded text-[10px] text-amber-200/60 border border-white/5">
                <span className="block mb-1 text-amber-600 font-bold uppercase">Function Keys (Macros):</span>
                <ul className="list-none space-y-1">
                  {Object.values(functionKeys).map((fn) => (
                    <li key={fn.key} className="flex justify-between border-b border-white/5 pb-0.5">
                      <span className="text-amber-500 font-bold">{fn.key}</span>
                      <span>{fn.label || 'Empty'}</span>
                    </li>
                  ))}
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
          </div>
        )}

        {/* VIEW: PROGRAMMER (EDITOR) */}
        {activeTab === 'PROGRAMMER' && currentConfig && (
          <div className="space-y-4 animate-in fade-in duration-300 h-full flex flex-col">
            
            {/* Key Selector */}
            <div className="flex gap-2 p-1 bg-[#111] rounded border border-[#222]">
              {['F1', 'F2', 'F3', 'F4', 'F5'].map(key => (
                <button
                  key={key}
                  onClick={() => setEditingKey(key)}
                  className={`flex-1 py-1.5 text-[10px] font-bold rounded transition-colors ${
                    editingKey === key 
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-600/50' 
                    : 'text-gray-500 hover:bg-[#222]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-4 pr-1">
              
              {/* Label */}
              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-gray-500 uppercase tracking-widest">Macro Label</label>
                <input 
                  type="text" 
                  value={currentConfig.label}
                  onChange={(e) => handleConfigChange('label', e.target.value)}
                  className="bg-[#050505] border border-[#333] text-amber-100 text-xs p-2 rounded focus:border-amber-500 focus:outline-none font-mono"
                  placeholder="e.g. Orbit Insert"
                />
              </div>

              {/* Registers Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 uppercase">VERB</label>
                  <input 
                    type="text" maxLength={2}
                    value={currentConfig.verb}
                    onChange={(e) => handleConfigChange('verb', e.target.value)}
                    className="bg-[#050505] border border-[#333] text-[#39ff14] text-center font-bold p-1 rounded focus:border-[#39ff14] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 uppercase">NOUN</label>
                  <input 
                    type="text" maxLength={2}
                    value={currentConfig.noun}
                    onChange={(e) => handleConfigChange('noun', e.target.value)}
                    className="bg-[#050505] border border-[#333] text-[#39ff14] text-center font-bold p-1 rounded focus:border-[#39ff14] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-gray-500 uppercase">PROG</label>
                  <input 
                    type="text" maxLength={2}
                    value={currentConfig.prog}
                    onChange={(e) => handleConfigChange('prog', e.target.value)}
                    className="bg-[#050505] border border-[#333] text-[#39ff14] text-center font-bold p-1 rounded focus:border-[#39ff14] focus:outline-none"
                  />
                </div>
              </div>

              {/* Data Registers */}
              <div className="space-y-2 bg-[#111] p-3 rounded border border-[#222]">
                {['r1', 'r2', 'r3'].map((reg) => (
                  <div key={reg} className="flex items-center gap-2">
                    <label className="text-[9px] text-gray-500 uppercase w-4 font-bold">{reg.toUpperCase()}</label>
                    <select
                      value={currentConfig[`${reg}Sign` as keyof FunctionKeyConfig] as string}
                      onChange={(e) => handleConfigChange(`${reg}Sign` as keyof FunctionKeyConfig, e.target.value)}
                      className="bg-[#050505] text-[#39ff14] border border-[#333] rounded text-xs p-1 focus:outline-none"
                    >
                      <option value="+">+</option>
                      <option value="-">-</option>
                      <option value="">_</option>
                    </select>
                    <input 
                      type="text" maxLength={5}
                      value={currentConfig[reg as keyof FunctionKeyConfig] as string}
                      onChange={(e) => handleConfigChange(reg as keyof FunctionKeyConfig, e.target.value)}
                      className="flex-1 bg-[#050505] border border-[#333] text-[#39ff14] font-mono tracking-widest p-1 rounded focus:border-[#39ff14] focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Status Flags Checkboxes */}
              <div>
                <label className="text-[9px] text-gray-500 uppercase tracking-widest mb-2 block">Status Indicators</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {STATUS_LABELS.map(({ id, label }) => (
                    <label key={id} className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-3 h-3 border rounded-sm flex items-center justify-center ${currentConfig.status[id as keyof typeof currentConfig.status] ? 'bg-amber-600 border-amber-600' : 'border-[#444] group-hover:border-amber-500'}`}>
                        {currentConfig.status[id as keyof typeof currentConfig.status] && <div className="w-1.5 h-1.5 bg-black rounded-[1px]"></div>}
                      </div>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={!!currentConfig.status[id as keyof typeof currentConfig.status]}
                        onChange={() => handleStatusChange(id)}
                      />
                      <span className="text-[9px] text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#222] text-center mt-auto">
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

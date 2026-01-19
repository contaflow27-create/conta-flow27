import React from 'react';
import { LayoutDashboard, FolderOpen, Cpu, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className="w-64 h-full border-r border-cyan-500/20 bg-slate-900/80 backdrop-blur-md flex flex-col p-4 fixed left-0 top-16 z-20 hidden md:flex">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px]">
           <img 
            src="https://picsum.photos/seed/operator/200/200" 
            alt="Operator" 
            className="w-full h-full rounded-full object-cover border-2 border-slate-900"
          />
        </div>
        <div>
          <div className="text-xs text-cyan-400 font-mono tracking-wider">OPERATOR</div>
          <div className="text-[10px] text-slate-500 font-mono">BLUE_UNIT // 0921</div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <NavItem active icon={<LayoutDashboard size={18} />} label="Workstation" />
        <NavItem icon={<FolderOpen size={18} />} label="Data Assets" />
        <NavItem icon={<Cpu size={18} />} label="Core Memory" />
      </nav>

      <div className="border-t border-cyan-500/10 pt-4 space-y-2">
        <NavItem icon={<Settings size={18} />} label="System Config" />
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all text-sm font-mono group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span>TERMINATE</span>
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-mono tracking-wide
    ${active 
      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
      : 'text-slate-400 hover:text-cyan-200 hover:bg-cyan-500/5'
    }`}>
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;

import { useState } from 'react';
import {
    Minus, Square, Circle as CircleIcon,
    Type, Hash, Move, Copy, RotateCw, Trash2,
    Scissors, Scale, FoldHorizontal, Box, Layers,
    Eye, Layout, Maximize, Plus, CornerUpLeft, CornerUpRight, Ruler
} from 'lucide-react';

interface ToolButtonProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    large?: boolean;
}

const ToolButton = ({ icon, label, active, onClick, large }: ToolButtonProps) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center group relative p-1 rounded hover:bg-gray-700 transition-colors ${active ? 'bg-blue-900/50 text-blue-400' : 'text-gray-300'}`}
        title={label}
    >
        <div className={`flex items-center justify-center ${large ? 'w-8 h-8 mb-1' : 'w-5 h-5 mb-0.5'}`}>
            {icon}
        </div>
        <span className={`${large ? 'text-[10px]' : 'text-[9px]'} font-medium leading-tight text-center max-w-[60px] truncate`}>
            {label}
        </span>
    </button>
);

const RibbonGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col h-full px-2 border-r border-gray-700 relative">
        <div className="flex-1 flex flex-wrap gap-1 content-start justify-center">
            {children}
        </div>
        <div className="text-[10px] text-gray-500 font-semibold text-center mt-1 uppercase tracking-wider bg-gray-800/50 py-0.5 rounded">
            {title}
        </div>
    </div>
);

interface RibbonProps {
    activeTool: string;
    setTool: (tool: string) => void;
}

const Ribbon = ({ activeTool, setTool }: RibbonProps) => {
    const [activeTab, setActiveTab] = useState('Home');
    const tabs = ['Home', 'Insert', 'Annotate', 'Parametric', 'View', 'Manage', 'Output', 'Add-ins', 'Collaborate'];

    return (
        <div className="flex flex-col bg-[#2b2d30] border-b border-black select-none">
            {/* Tabs */}
            <div className="flex items-center px-1 bg-[#2b2d30]">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-xs font-medium border-t-2 transition-colors ${activeTab === tab
                            ? 'bg-[#404246] text-white border-blue-500 rounded-t'
                            : 'text-gray-400 border-transparent hover:bg-[#35373a] hover:text-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Toolbar Area */}
            <div className="h-24 bg-[#404246] flex items-stretch px-1 py-1 shadow-inner overflow-x-auto scrolbar-thin">
                {activeTab === 'Home' && (
                    <>
                        <RibbonGroup title="Draw">
                            <div className="grid grid-cols-3 gap-1">
                                <ToolButton icon={<Minus size={18} />} label="Line" active={activeTool === 'line'} onClick={() => setTool('line')} />
                                <ToolButton icon={<CornerUpRight size={18} />} label="Polyline" onClick={() => setTool('polyline')} />
                                <ToolButton icon={<CircleIcon size={18} />} label="Circle" active={activeTool === 'circle'} onClick={() => setTool('circle')} />
                                <ToolButton icon={<Box size={18} />} label="Arc" onClick={() => setTool('arc')} />
                                <ToolButton icon={<Square size={18} />} label="Rect" active={activeTool === 'rect'} onClick={() => setTool('rect')} />
                                <ToolButton icon={<Layout size={18} />} label="Polygon" onClick={() => setTool('polygon')} />
                                <ToolButton icon={<Hash size={18} />} label="Hatch" onClick={() => setTool('hatch')} />
                            </div>
                        </RibbonGroup>

                        <RibbonGroup title="Modify">
                            <div className="grid grid-cols-4 gap-1">
                                <ToolButton icon={<Move size={16} />} label="Move" active={activeTool === 'pan'} onClick={() => setTool('pan')} />
                                <ToolButton icon={<Copy size={16} />} label="Copy" onClick={() => setTool('copy')} />
                                <ToolButton icon={<RotateCw size={16} />} label="Rotate" onClick={() => setTool('rotate')} />
                                <ToolButton icon={<FoldHorizontal size={16} />} label="Mirror" onClick={() => setTool('mirror')} />
                                <ToolButton icon={<Scale size={16} />} label="Scale" onClick={() => setTool('scale')} />
                                <ToolButton icon={<Scissors size={16} />} label="Trim" onClick={() => setTool('trim')} />
                                <ToolButton icon={<CornerUpLeft size={16} />} label="Fillet" onClick={() => setTool('fillet')} />
                                <ToolButton icon={<Box size={16} />} label="Array" onClick={() => setTool('array')} />
                                <ToolButton icon={<Trash2 size={16} />} label="Erase" onClick={() => setTool('erase')} />
                                <ToolButton icon={<Box size={16} />} label="Explode" onClick={() => setTool('explode')} />
                            </div>
                        </RibbonGroup>

                        <RibbonGroup title="Annotation">
                            <div className="flex flex-col gap-1">
                                <ToolButton icon={<Type size={20} />} label="Text" onClick={() => setTool('text')} />
                                <ToolButton icon={<Ruler size={20} />} label="Dim" onClick={() => setTool('dimension')} />
                            </div>
                        </RibbonGroup>

                        <RibbonGroup title="Layers">
                            <div className="flex flex-col items-start w-32 gap-1 px-1">
                                <div className="flex items-center space-x-2 w-full bg-gray-700 p-1 rounded border border-gray-600">
                                    <div className="w-4 h-4 bg-white border border-gray-400"></div>
                                    <span className="text-xs text-white truncate">0 (Default)</span>
                                </div>
                                <div className="flex space-x-1">
                                    <ToolButton icon={<Layers size={16} />} label="Props" onClick={() => { }} />
                                    <ToolButton icon={<Eye size={16} />} label="Off" onClick={() => { }} />
                                </div>
                            </div>
                        </RibbonGroup>

                        <RibbonGroup title="Properties">
                            <div className="flex flex-col gap-1 w-24">
                                <div className="text-[10px] text-gray-300">ByLayer</div>
                                <div className="h-px bg-gray-600 w-full"></div>
                                <div className="text-[10px] text-gray-300">ByLayer</div>
                                <div className="h-px bg-gray-600 w-full"></div>
                                <div className="text-[10px] text-gray-300">ByLayer</div>
                            </div>
                        </RibbonGroup>
                    </>
                )}

                {activeTab === 'View' && (
                    <RibbonGroup title="Views">
                        <ToolButton icon={<Maximize size={24} />} label="Extents" large onClick={() => { }} />
                        <ToolButton icon={<Layout size={24} />} label="Viewports" large onClick={() => { }} />
                    </RibbonGroup>
                )}

                {/* 3D Tools Placeholder */}
                {activeTab === 'Insert' && (
                    <RibbonGroup title="Block">
                        <ToolButton icon={<Box size={24} />} label="Insert" large onClick={() => { }} />
                        <ToolButton icon={<Plus size={24} />} label="Create" large onClick={() => { }} />
                    </RibbonGroup>
                )}
            </div>
        </div>
    );
};

export default Ribbon;

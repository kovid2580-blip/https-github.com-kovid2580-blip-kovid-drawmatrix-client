import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Settings2, ChevronDown, Move, Maximize, RotateCw, Plus, Minus, Layers } from 'lucide-react';
import Ribbon from '../components/editor/Ribbon';
import { CommandBar, StatusBar } from '../components/editor/BottomBar';

// Types and helper functions remain same...


interface Shape {
    id: string;
    type: 'line' | 'rect' | 'circle' | 'polyline';
    points?: number[];
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    stroke: string;
    strokeWidth: number;
}

const SOCKET_URL = import.meta.env.PROD ? 'https://kovid-drawmatrix-server.onrender.com' : 'http://localhost:3001';
const socket = io(SOCKET_URL);

const Editor = () => {
    const { projectId } = useParams();
    const [tool, setTool] = useState<string>('select'); // Generalized tool string
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const stageRef = useRef<any>(null);

    // --- Socket Logic ---
    useEffect(() => {
        socket.emit('join_project', projectId);
        socket.on('remote_draw_event', (data: Shape) => {
            setShapes((prev) => [...prev, data]);
        });
        return () => {
            socket.off('remote_draw_event');
        };
    }, [projectId]);

    // --- Interaction Logic ---
    const handleWheel = (e: any) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();
        const scaleBy = 1.1;
        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };
        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        setScale(newScale);
        setPosition(newPos);
    };

    const handleMouseDown = (e: any) => {
        if (tool === 'pan' || tool === 'select') return;
        setIsDrawing(true);
        const pos = e.target.getStage().getRelativePointerPosition();
        const id = crypto.randomUUID();
        let newShape: Shape | null = null;

        if (tool === 'line') {
            newShape = { id, type: 'line', points: [pos.x, pos.y, pos.x, pos.y], stroke: '#ffffff', strokeWidth: 1 }; // Default white stroke for CAD
        } else if (tool === 'rect') {
            newShape = { id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, stroke: '#ffffff', strokeWidth: 1 };
        }
        if (newShape) setShapes([...shapes, newShape]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing) return;
        const stage = e.target.getStage();
        const pos = stage.getRelativePointerPosition();

        setShapes(prev => {
            const lastShape = prev[prev.length - 1];
            const newShapes = prev.slice(0, prev.length - 1);
            let updatedShape = lastShape;

            if (lastShape.type === 'line') {
                updatedShape = { ...lastShape, points: [lastShape.points![0], lastShape.points![1], pos.x, pos.y] };
            } else if (lastShape.type === 'rect') {
                updatedShape = { ...lastShape, width: pos.x - lastShape.x!, height: pos.y - lastShape.y! };
            }
            return [...newShapes, updatedShape];
        });
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const lastShape = shapes[shapes.length - 1];
            if (lastShape) socket.emit('draw_event', { projectId, ...lastShape });
        }
    };

    return (
        <div className="flex flex-col h-screen bg-[#222222] overflow-hidden font-sans text-gray-200">
            {/* Top Title Bar (Application Menu) */}
            <div className="h-8 bg-[#1f2023] flex items-center justify-between px-2 border-b border-black select-none">
                <div className="flex items-center space-x-4">
                    <div className="text-red-600 font-bold text-lg px-2">D</div>
                    <div className="text-xs text-gray-400">Draw Matrix 2026 - [{projectId}.dwg]</div>
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-2 hover:bg-gray-700 text-xs text-gray-400">Sign In</button>
                    <button className="px-2 hover:bg-gray-700 text-xs text-gray-400">Help</button>
                </div>
            </div>

            {/* Ribbon Interface */}
            <Ribbon activeTool={tool} setTool={setTool} />

            {/* Main Workspace Area */}
            <div className="flex-1 flex relative overflow-hidden">
                {/* Left Tool Palette (Optional) */}
                <div className="w-10 bg-[#2b2d30] border-r border-black flex flex-col items-center py-2 space-y-2">
                    {/* Placeholder for tool palette icons */}
                    <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                    <div className="w-6 h-6 bg-gray-600 rounded-sm"></div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 bg-[#212223] relative cursor-crosshair overflow-hidden">
                    {/* CAD Grid Background */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    ></div>

                    <Stage
                        width={window.innerWidth - 300} // Adjust for panels
                        height={window.innerHeight - 150} // Adjust for bars
                        draggable={tool === 'pan'}
                        onWheel={handleWheel}
                        scaleX={scale}
                        scaleY={scale}
                        x={position.x}
                        y={position.y}
                        ref={stageRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                    >
                        <Layer>
                            {/* Mock 3D Isometric Structure (Fire Station) */}
                            <Line points={[100, 300, 300, 400, 300, 200, 100, 100]} closed stroke="#00FFFF" strokeWidth={2} /> {/* Left Wall */}
                            <Line points={[300, 400, 600, 300, 600, 100, 300, 200]} closed stroke="#FFFF00" strokeWidth={2} /> {/* Front Wall */}
                            <Line points={[100, 100, 300, 200, 600, 100, 400, 0]} closed stroke="#FF00FF" strokeWidth={2} /> {/* Roof */}

                            {/* Windows */}
                            <Rect x={350} y={250} width={40} height={60} stroke="#00FF00" strokeWidth={1} rotation={-15} skewX={-0.2} />
                            <Rect x={450} y={220} width={40} height={60} stroke="#00FF00" strokeWidth={1} rotation={-15} skewX={-0.2} />

                            {/* Garage Door */}
                            <Line points={[520, 280, 580, 260, 580, 150, 520, 170]} closed stroke="#FFA500" strokeWidth={2} />

                            {shapes.map((shape) => {
                                if (shape.type === 'line') {
                                    return <Line key={shape.id} points={shape.points} stroke={shape.stroke} strokeWidth={shape.strokeWidth / scale} lineCap="round" lineJoin="round" />;
                                } else if (shape.type === 'rect') {
                                    return <Rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} stroke={shape.stroke} strokeWidth={shape.strokeWidth / scale} />;
                                }
                                return null;
                            })}
                        </Layer>
                    </Stage>

                    {/* View Cube */}
                    <div className="absolute top-4 right-4 w-28 h-28 pointer-events-none opacity-90 transition-opacity hover:opacity-100">
                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                            <path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z" fill="#2b2d30" stroke="#666" strokeWidth="1" />
                            <path d="M50 50 L90 30" stroke="#666" strokeWidth="1" />
                            <path d="M50 50 L10 30" stroke="#666" strokeWidth="1" />
                            <path d="M50 50 L50 90" stroke="#666" strokeWidth="1" />
                            <text x="50" y="28" textAnchor="middle" fill="#ccc" fontSize="8" fontWeight="bold">TOP</text>
                            <text x="25" y="65" textAnchor="middle" fill="#ccc" fontSize="8" fontWeight="bold" transform="rotate(-30 25,65)">LEFT</text>
                            <text x="75" y="65" textAnchor="middle" fill="#ccc" fontSize="8" fontWeight="bold" transform="rotate(30 75,65)">RIGHT</text>
                            {/* Compass Ring */}
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#444" strokeWidth="4" strokeDasharray="10 5" opacity="0.5" />
                            <text x="50" y="8" textAnchor="middle" fill="#888" fontSize="6">N</text>
                            <text x="50" y="96" textAnchor="middle" fill="#888" fontSize="6">S</text>
                            <text x="94" y="52" textAnchor="middle" fill="#888" fontSize="6">E</text>
                            <text x="6" y="52" textAnchor="middle" fill="#888" fontSize="6">W</text>
                        </svg>
                    </div>

                    {/* UCS Icon */}
                    <div className="absolute bottom-12 left-12 w-12 h-12 pointer-events-none">
                        <svg viewBox="0 0 50 50" className="w-full h-full">
                            <line x1="5" y1="45" x2="45" y2="45" stroke="#ff0000" strokeWidth="2" /> {/* X Axis */}
                            <line x1="5" y1="45" x2="5" y2="5" stroke="#00ff00" strokeWidth="2" /> {/* Y Axis */}
                            <text x="45" y="42" fill="#ff0000" fontSize="10" fontWeight="bold">X</text>
                            <text x="8" y="10" fill="#00ff00" fontSize="10" fontWeight="bold">Y</text>
                            <rect x="3" y="43" width="4" height="4" fill="#333" />
                        </svg>
                    </div>

                    {/* Navigation Bar (Right Side) */}
                    <div className="absolute top-36 right-4 flex flex-col bg-[#2b2d30]/90 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
                        <button className="p-2 hover:bg-gray-600 text-gray-300" title="Full Navigation Wheel"><div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div></button>
                        <button className="p-2 hover:bg-gray-600 text-gray-300" title="Pan"><Move size={18} /></button>
                        <button className="p-2 hover:bg-gray-600 text-gray-300" title="Zoom Extents"><Maximize size={18} /></button>
                        <button className="p-2 hover:bg-gray-600 text-gray-300" title="Orbit"><RotateCw size={18} /></button>
                    </div>

                    {/* Layout Tabs */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#2b2d30] flex items-center px-1 border-t border-black">
                        <button className="px-3 py-1 bg-[#404246] text-white text-xs font-medium border-t-2 border-green-500">Model</button>
                        <button className="px-3 py-1 text-gray-400 hover:bg-[#35373a] text-xs">Layout1</button>
                        <button className="px-3 py-1 text-gray-400 hover:bg-[#35373a] text-xs">Layout2</button>
                        <button className="px-2 text-gray-400 hover:text-white"><Plus size={12} /></button>
                    </div>

                    {/* Command Line */}
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-1/2 bg-[#2b2d30]/90 backdrop-blur-sm border border-gray-600 shadow-xl rounded flex flex-col text-gray-300 font-mono text-xs">
                        <div className="h-6 px-2 flex items-center border-b border-gray-700 opacity-50 text-[10px]">
                            <span className="mr-auto">Command Line</span>
                            <button className="hover:text-white"><Minus size={10} /></button>
                        </div>
                        <div className="p-2 h-16 overflow-y-auto">
                            <div className="text-gray-500">Type a command</div>
                            <div className="flex items-center">
                                <span className="text-gray-400 mr-2">Command:</span>
                                <input type="text" className="bg-transparent border-none outline-none text-white w-full" autoFocus />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Properties Panel (Docked) */}
                <div className="w-72 bg-[#2b2d30] border-l border-black flex flex-col hidden lg:flex">
                    <div className="bg-[#2b2d30] p-1 flex items-center justify-between border-b border-gray-700">
                        <span className="text-xs font-bold text-gray-300 uppercase pl-2">Properties</span>
                        <Settings2 size={14} className="text-gray-400" />
                    </div>
                    <div className="p-2 space-y-3 overflow-y-auto custom-scrollbar">
                        {/* General Section */}
                        <div className="space-y-1">
                            <div className="bg-[#404246] px-2 py-1 text-[11px] font-bold text-gray-300 flex items-center"><ChevronDown size={10} className="mr-1" /> General</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 text-xs">
                                <div className="text-gray-400">Color</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-white mr-1 border border-gray-500"></div> ByLayer</div>

                                <div className="text-gray-400">Layer</div>
                                <div className="flex items-center"><Layers size={10} className="mr-1" /> 0</div>

                                <div className="text-gray-400">Linetype</div>
                                <div>ByLayer</div>

                                <div className="text-gray-400">Linetype Scale</div>
                                <div>1.0000</div>

                                <div className="text-gray-400">Lineweight</div>
                                <div>ByLayer</div>

                                <div className="text-gray-400">Transparency</div>
                                <div>0</div>

                                <div className="text-gray-400">Thickness</div>
                                <div>0.0000</div>
                            </div>
                        </div>
                        {/* 3D Visualization */}
                        <div className="space-y-1">
                            <div className="bg-[#404246] px-2 py-1 text-[11px] font-bold text-gray-300 flex items-center"><ChevronDown size={10} className="mr-1" /> 3D Visualization</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 text-xs">
                                <div className="text-gray-400">Material</div>
                                <div>ByLayer</div>
                            </div>
                        </div>

                        {/* View Section */}
                        <div className="space-y-1">
                            <div className="bg-[#404246] px-2 py-1 text-[11px] font-bold text-gray-300 flex items-center"><ChevronDown size={10} className="mr-1" /> View</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 px-2 text-xs">
                                <div className="text-gray-400">Center X</div>
                                <div>{position.x.toFixed(4)}</div>
                                <div className="text-gray-400">Center Y</div>
                                <div>{position.y.toFixed(4)}</div>
                                <div className="text-gray-400">Height</div>
                                <div>{(window.innerHeight).toFixed(4)}</div>
                                <div className="text-gray-400">Width</div>
                                <div>{(window.innerWidth).toFixed(4)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar Area */}
            <CommandBar />
            <StatusBar />
        </div>
    );
};

export default Editor;


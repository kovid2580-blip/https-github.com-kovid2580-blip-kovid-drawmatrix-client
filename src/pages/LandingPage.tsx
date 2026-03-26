import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Layers, Zap, ArrowRight, Hexagon, Cpu } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col font-sans text-white selection:bg-cyan-500 selection:text-white bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400">
            <ParticleBackground />

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-white/10 border-b border-white/20">
                <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-400/50 transition-all duration-300 transform group-hover:scale-110">
                        <Hexagon className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-white">
                        Draw Matrix
                    </span>
                </div>

                <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-blue-100 tracking-wide">
                    <a href="#" className="hover:text-white transition-colors">Features</a>
                    <a href="#" className="hover:text-white transition-colors">Enterprise</a>
                    <a href="#" className="hover:text-white transition-colors">Pricing</a>
                    <a href="#" className="hover:text-white transition-colors">Docs</a>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-sm font-semibold text-blue-100 hover:text-white transition-colors"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/50 mb-8 shadow-sm ring-1 ring-gray-900/5 hover:ring-gray-900/10 transition-all cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">v2.0 Now Live</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-gray-900">
                        Design the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 animate-gradient bg-300% text-glow">
                            Impossible.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                        Draw Matrix is the next-generation architectural workspace.
                        <br className="hidden md:block" />
                        Real-time collaboration, infinite canvas, and AI-powered drafting.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <button
                            onClick={() => navigate('/editor/new')}
                            className="w-full md:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-purple-500/30 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2 group"
                        >
                            <span>Launch Editor</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="w-full md:w-auto px-10 py-5 rounded-full bg-white text-gray-900 border border-gray-200 font-bold text-lg hover:bg-gray-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2">
                            <Monitor size={20} />
                            <span>Download App</span>
                        </button>
                    </div>
                </motion.div>

                {/* Glass Cards */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
                    <FeatureCard
                        icon={<Zap size={32} className="text-yellow-500" />}
                        title="Zero Latency"
                        desc="Built on a custom Rust-based engine for 60fps performance on any device."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Layers size={32} className="text-blue-500" />}
                        title="Infinite Layers"
                        desc="Organize complex projects with our intelligent, nesting layer system."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Cpu size={32} className="text-purple-500" />}
                        title="AI Drafting"
                        desc="Let our neural network suggest layouts and optimize floor plans instantly."
                        delay={0.6}
                    />
                </div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="glass-panel p-8 rounded-3xl text-left hover:-translate-y-2 transition-transform duration-300"
    >
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl inline-block shadow-inner">{icon}</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
);

export default LandingPage;

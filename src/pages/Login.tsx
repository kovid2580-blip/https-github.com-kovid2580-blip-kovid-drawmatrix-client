import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import ParticleBackground from '../components/ParticleBackground';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post('http://localhost:3001/login', formData);
            if (res.data.user) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data));
                navigate('/');
            }
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data.errors) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors).find(e => e !== '') as string;
                setError(firstError || 'Login failed');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-600 to-cyan-400">
            <ParticleBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-panel p-8 rounded-3xl w-full max-w-md mx-4 relative z-10 bg-white/10 border-white/20 shadow-2xl backdrop-blur-xl"
            >
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">D</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white">Draw Matrix</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h2>
                    <p className="text-blue-100 mt-2">Sign in to continue your journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-antigravity-muted mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-antigravity-accent focus:ring-2 focus:ring-antigravity-accent/20 outline-none transition-all"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-antigravity-muted mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-antigravity-accent focus:ring-2 focus:ring-antigravity-accent/20 outline-none transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-antigravity-accent to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-antigravity-muted">
                    Don't have an account? <Link to="/signup" className="text-antigravity-accent font-semibold hover:underline">Sign up</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

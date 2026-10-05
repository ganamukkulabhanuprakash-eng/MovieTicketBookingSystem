import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Clapperboard, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authApi.login({ email: formData.email, password: formData.password });
      if (!data.token) {
        setError(data.message || 'Login failed. Please check your credentials.');
        return;
      }
      login(data);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-surface p-8 rounded-2xl shadow-lg border border-border"
      >
        <div className="flex flex-col items-center">
          <Clapperboard className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-center text-3xl font-extrabold text-text-primary">
            Sign in to CineVault
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Use your email and password to sign in
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/register" className="text-sm font-medium text-primary hover:text-primary-hover">
            Don&apos;t have an account? Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

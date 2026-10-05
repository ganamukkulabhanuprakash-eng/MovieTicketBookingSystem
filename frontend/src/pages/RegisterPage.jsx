import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Clapperboard, User, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await authApi.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Join CineVault and start booking movies
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
              <User className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
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
                minLength={6}
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-text-muted" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm font-medium text-primary hover:text-primary-hover">
            Already have an account? Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

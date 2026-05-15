import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import api from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const payload = isLogin
        ? { email, password }
        : { name: email.split('@')[0], email, password };

      const res = await api.post(endpoint, payload);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RecallPG</h1>
          <p className="text-slate-500 mt-2">Turn your NEET-PG PDFs into teaching, testing, and revision.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full">{isLogin ? 'Sign In' : 'Sign Up'}</Button>
        </form>
        <div className="mt-4 text-center">
          <button onClick={() => setIsLogin(!isLogin)} type="button" className="text-sm text-primary hover:underline">
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

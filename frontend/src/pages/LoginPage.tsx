import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError('');
        try {
            await login(data.email, data.password);
            navigate(from, { replace: true });
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ffffff] py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-[#ffffff] rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-10">
                    <div className="text-center mb-10">
                        <div className="relative w-24 h-24 mx-auto mb-8 group/logo cursor-pointer">
                            <div className="absolute inset-0 bg-[#0066ff] rounded-[2rem] rotate-45 opacity-20 group-hover/logo:rotate-90 transition-transform duration-700" />
                            <div className="relative w-full h-full bg-[#000000] rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-[#0066ff]/20 group-hover/logo:border-[#0066ff] transition-all duration-500">
                                <span className="text-[#ffffff] font-black text-4xl tracking-tighter">LX</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-black text-[#000000] uppercase tracking-tighter">ACCESS GRANTED</h1>
                        <p className="text-[#0066ff] font-black uppercase tracking-[0.2em] text-[10px] mt-2">LOGIN TO YOUR ELITE ACCOUNT</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-[#ff2d55] font-black uppercase text-xs tracking-widest bg-[#ff2d55]/5 py-4 rounded-xl border-2 border-transparent hover:border-[#ff2d55]/20 cursor-pointer">
                        <Link to="/forgot-password">
                            FORGOT ACCESS KEY?
                        </Link>
                    </div>

                    <div className="mt-10 pt-8 border-t-4 border-[#000000] text-center">
                        <p className="text-[#000000] font-black uppercase text-xs tracking-widest">
                            NO ACCOUNT?{' '}
                            <Link to="/register" className="text-[#0066ff] hover:underline">
                                CREATE ONE NOW
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        setError('');
        try {
            await registerUser(data.name, data.email, data.password);
            navigate('/');
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed');
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
                            <div className="relative w-full h-full bg-[#0066ff] rounded-[1.5rem] flex items-center justify-center shadow-2xl border-4 border-[#000000]/10 group-hover/logo:border-[#000000]/20 transition-all duration-500">
                                <span className="text-[#ffffff] font-black text-4xl tracking-tighter">LX</span>
                            </div>
                        </div>
                        <h1 className="text-4xl font-display font-black text-[#000000] uppercase tracking-tighter">JOIN THE ELITE</h1>
                        <p className="text-[#0066ff] font-black uppercase tracking-[0.2em] text-[10px] mt-2">CREATE YOUR LUXESTORE ACCOUNT</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            id="name"
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            {...register('name')}
                        />

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

                        <Input
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t-4 border-[#000000] text-center">
                        <p className="text-[#000000] font-black uppercase text-xs tracking-widest">
                            ALREADY ENROLLED?{' '}
                            <Link to="/login" className="text-[#0066ff] hover:underline">
                                SIGN IN
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

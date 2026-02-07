import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Input } from '../components/ui/Input';
import { User, Shield, Key } from 'lucide-react';

const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuth();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess(false);
        try {
            const updatedUser = await authApi.updateProfile({
                name: data.name,
                email: data.email,
                ...(data.password ? { password: data.password } : {}),
            });
            setUser(updatedUser);
            setSuccess(true);
        } catch (err: unknown) {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Update failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#000000] mb-12 uppercase tracking-tighter leading-none">IDENTITY</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Profile Overview */}
                <div className="md:col-span-1">
                    <div className="bg-[#000000] rounded-[2.5rem] p-10 text-white shadow-2xl">
                        <div className="w-24 h-24 bg-[#0066ff] rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-[#0066ff]/20">
                            <User className="w-12 h-12" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-3xl font-display font-black uppercase tracking-tighter mb-2">{user?.name}</h2>
                        <p className="text-[#a1a1aa] font-black uppercase tracking-widest text-[10px] mb-8">{user?.email}</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                <Shield className="w-5 h-5 text-[#0066ff]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {user?.isAdmin ? 'ADMIN ACCESS' : 'STANDARD MEMBER'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="md:col-span-2">
                    <div className="bg-[#ffffff] rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-10">
                        <div className="flex items-center gap-4 mb-10 border-b-4 border-[#000000]/5 pb-6">
                            <Key className="w-8 h-8 text-[#000000]" strokeWidth={2.5} />
                            <h2 className="text-3xl font-display font-black text-[#000000] uppercase tracking-tighter">SECURE SETTINGS</h2>
                        </div>

                        {success && (
                            <div className="bg-[#000000] text-white p-6 rounded-2xl font-black uppercase tracking-widest text-xs mb-8 flex items-center justify-between border-l-[12px] border-[#0066ff] shadow-xl animate-fade-in">
                                <span>PROFILE UPDATED SUCCESSFULLY</span>
                                <div className="w-6 h-6 bg-[#0066ff] rounded-full flex items-center justify-center">
                                    <Shield className="w-4 h-4" />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-[#ff2d55] text-white p-6 rounded-2xl font-black uppercase tracking-widest text-xs mb-8 border-l-[12px] border-[#000000] shadow-xl">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <Input
                                id="name"
                                label="LEGAL NAME"
                                placeholder="Edit your name"
                                error={errors.name?.message}
                                {...register('name')}
                                className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                            />

                            <Input
                                id="email"
                                label="EMAIL ADDRESS"
                                placeholder="Edit your email"
                                error={errors.email?.message}
                                {...register('email')}
                                className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                            />

                            <div className="pt-6 border-t-4 border-[#000000]/5">
                                <p className="text-[10px] font-black text-[#71717a] uppercase tracking-widest mb-6">SECURITY UPGRADE (OPTIONAL)</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input
                                        id="password"
                                        label="NEW ACCESS KEY"
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.password?.message}
                                        {...register('password')}
                                        className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                                    />
                                    <Input
                                        id="confirmPassword"
                                        label="CONFIRM KEY"
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.confirmPassword?.message}
                                        {...register('confirmPassword')}
                                        className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#0066ff] hover:bg-[#0055ee] text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-[#0066ff]/20 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? 'AUTHORIZING...' : 'UPDATE IDENTITY'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

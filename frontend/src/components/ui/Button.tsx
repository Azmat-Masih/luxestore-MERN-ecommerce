import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
        primary: 'bg-[#0066ff] text-[#ffffff] hover:bg-[#0055ee] focus:ring-[#0066ff] shadow-xl shadow-[#0066ff]/20 border border-[#0066ff]/10',
        secondary: 'bg-[#000000] text-[#ffffff] hover:bg-[#1a1a1a] focus:ring-[#000000] border border-[#000000]/20',
        outline: 'border-2 border-[#000000] text-[#000000] hover:bg-[#000000] hover:text-[#ffffff] focus:ring-[#000000]',
        ghost: 'text-[#000000] hover:bg-[#000000]/5 hover:text-[#0066ff] focus:ring-[#0066ff]',
        danger: 'bg-[#ff2d55] text-[#ffffff] hover:bg-[#e11d48] focus:ring-[#ff2d55] shadow-xl shadow-[#ff2d55]/20 border border-[#ff2d55]/10',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
};

import React from 'react';
import { cn } from '../../lib/utils';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}) {
  const variantClasses = {
    primary: `bg-linear-to-r from-primary-500 to-primary-600 text-white
              hover:from-primary-600 hover:to-primary-700
              shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30
              disabled:from-primary-300 disabled:to-primary-400 disabled:shadow-none`,
    secondary: `bg-gray-100 text-gray-700
                hover:bg-gray-200
                disabled:bg-gray-50 disabled:text-gray-400`,
    danger: `bg-linear-to-r from-red-500 to-red-600 text-white
             hover:from-red-600 hover:to-red-700
             shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30
             disabled:from-red-300 disabled:to-red-400 disabled:shadow-none`,
    ghost: `bg-transparent text-gray-600
            hover:bg-gray-100 hover:text-gray-900
            disabled:text-gray-300`
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg'
  };

  return (
    <button
      className={cn(
        'rounded-xl font-semibold transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-4 focus:ring-primary-200',
        'disabled:cursor-not-allowed',
        'inline-flex items-center justify-center gap-2',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Cargando...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

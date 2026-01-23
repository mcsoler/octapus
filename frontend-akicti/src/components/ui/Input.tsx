import React from 'react';
import { cn } from '../../lib/utils';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full px-4 py-3 rounded-xl',
        'border-2 border-gray-100 bg-gray-50/50',
        'transition-all duration-200 ease-out',
        'focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:outline-none',
        'placeholder:text-gray-400',
        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full px-4 py-3 rounded-xl',
        'border-2 border-gray-100 bg-gray-50/50',
        'transition-all duration-200 ease-out',
        'focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 focus:outline-none',
        'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
        'appearance-none cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function Checkbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        'h-5 w-5 rounded-lg',
        'border-2 border-gray-200',
        'text-primary-500',
        'transition-all duration-200 ease-out',
        'focus:ring-4 focus:ring-primary-100 focus:ring-offset-0',
        'checked:bg-primary-500 checked:border-primary-500',
        'cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

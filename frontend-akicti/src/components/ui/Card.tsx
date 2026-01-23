import React from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-soft border border-gray-100/50',
        'transition-all duration-300 ease-out',
        'hover:shadow-elegant',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-5 border-b border-gray-100',
        'bg-linear-to-r from-gray-50/50 to-transparent',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
}

export function CardFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-6 py-4 border-t border-gray-100',
        'bg-linear-to-r from-gray-50/30 to-transparent',
        className
      )}
    >
      {children}
    </div>
  );
}

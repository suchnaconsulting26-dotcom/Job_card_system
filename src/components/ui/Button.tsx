import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus:ring-2 focus:ring-kraft-dark/50 disabled:pointer-events-none disabled:opacity-50',
                    {
                        'bg-industrial text-white hover:bg-industrial/90': variant === 'primary',
                        'bg-kraft-dark text-white hover:bg-kraft-dark/90': variant === 'secondary',
                        'border-2 border-industrial text-industrial hover:bg-industrial/10': variant === 'outline',
                        'hover:bg-industrial/5 text-industrial': variant === 'ghost',
                        'h-9 px-4 py-2 text-sm': size === 'sm',
                        'h-10 px-6 py-2': size === 'md',
                        'h-12 px-8 text-lg': size === 'lg',
                        'h-10 w-10': size === 'icon',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button };

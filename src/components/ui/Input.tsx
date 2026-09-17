import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, rightElement, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-industrial mb-1">
                        {label}
                    </label>
                )}
                <div className="relative flex items-center">
                    <input
                        type={type}
                        className={cn(
                            'flex h-10 w-full rounded-none border-b-2 border-industrial/20 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-industrial/40 focus-visible:outline-none focus-visible:border-industrial disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
                            rightElement && 'pr-10',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightElement && (
                        <div className="absolute right-2 flex items-center">
                            {rightElement}
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
Input.displayName = 'Input';

export { Input };

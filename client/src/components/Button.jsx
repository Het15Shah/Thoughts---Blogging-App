import React from 'react';

function Button({
  children,
  type = 'button',
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',           // 'sm' | 'md' | 'lg'
  loading = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-black rounded-full transition-all duration-200 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 ' +
    'active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

  const variants = {
    primary:   'bg-brand-purple text-white hover:bg-purple-700 hover:shadow-brand-md hover:-translate-y-0.5',
    secondary: 'bg-white text-brand-dark border-2 border-brand-dark hover:bg-brand-dark hover:text-white hover:-translate-y-0.5',
    ghost:     'bg-transparent text-gray-600 hover:text-brand-purple hover:bg-gray-50',
    danger:    'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white hover:-translate-y-0.5',
    outline:   'bg-transparent border-2 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white hover:-translate-y-0.5',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;

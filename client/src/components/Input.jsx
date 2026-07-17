import React, { useId } from 'react';

const Input = React.forwardRef(function Input(
  { label, type = 'text', error = '', className = '', ...props },
  ref
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1.5 text-xs font-bold uppercase tracking-widest text-gray-500"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        className={`
          w-full px-0 py-3 bg-transparent text-brand-dark text-base outline-none
          border-0 border-b-2 transition-colors duration-200 placeholder-gray-300
          focus:border-brand-purple
          ${error ? 'border-red-400' : 'border-black/15'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs font-bold text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;

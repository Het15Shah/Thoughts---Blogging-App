import React, { useId } from 'react';

const Select = React.forwardRef(function Select(
  { options = [], label, className = '', ...props },
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
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={`
            w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-gray-50 text-brand-dark text-sm font-semibold
            border-2 border-gray-200 outline-none cursor-pointer
            focus:border-brand-purple focus:bg-white transition-all duration-200
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {/* Custom chevron icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default Select;

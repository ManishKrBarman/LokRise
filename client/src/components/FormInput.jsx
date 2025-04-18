import React from 'react';

const FormInput = ({
    id,
    label,
    required = false,
    optional = false,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    className = '',
    maxLength,
    autoComplete,
    prefix,
    helperText
}) => {
    return (
        <div>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                    {optional && <span className="text-gray-400"> (Optional)</span>}
                </label>
            )}
            <div className={`mt-1 ${prefix ? 'flex rounded-md shadow-sm' : ''}`}>
                {prefix && (
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        {prefix}
                    </span>
                )}
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    maxLength={maxLength}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    className={`appearance-none block w-full px-3 py-2 border border-gray-300 ${prefix
                            ? 'rounded-none rounded-r-md'
                            : 'rounded-md'
                        } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                        } ${className}`}
                />
            </div>
            {helperText && (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            )}
        </div>
    );
};

export default FormInput;
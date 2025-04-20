import React from 'react';

const FormInput = ({
    id,
    name,
    label,
    type = 'text',
    value,
    onChange,
    required = false,
    disabled = false,
    autoComplete,
    placeholder,
    error,
    minLength,
    maxLength,
    min,
    max
}) => {
    // Use name prop if provided, otherwise fall back to id for backward compatibility
    const inputName = name || id;

    return (
        <div className="mb-4">
            <label htmlFor={inputName} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                id={inputName}
                name={inputName}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                autoComplete={autoComplete}
                placeholder={placeholder}
                minLength={minLength}
                maxLength={maxLength}
                min={min}
                max={max}
                className={`mt-1 block w-full rounded-md border shadow-sm px-3 py-2 ${disabled
                    ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                    : 'bg-white'
                    } ${error
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)]'
                    } sm:text-sm transition-colors`}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormInput;
import React from 'react';

const FormInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    min,
    max,
    minLength,
    maxLength,
    pattern,
    step,
    autoComplete,
    disabled = false,
    className = "",
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                minLength={minLength}
                maxLength={maxLength}
                pattern={pattern}
                step={step}
                autoComplete={autoComplete}
                disabled={disabled}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''
                    } ${className}`}
            />
        </div>
    );
};

export default FormInput;
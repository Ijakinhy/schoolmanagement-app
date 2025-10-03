import React, { useState, useRef, useEffect } from "react";
import {
    useController,
    UseControllerProps,
    FieldValues,
} from "react-hook-form";

interface OptionType {
    label: string;
    value: string;
}

interface MultiSelectProps<TFieldValues extends FieldValues = FieldValues>
    extends UseControllerProps<TFieldValues> {
    options: OptionType[];
    label: string;
    placeholder?: string;
    className?: string;
}

export const MultiSelect = <TFieldValues extends FieldValues = FieldValues>({
    name,
    control,
    options,
    label,
    placeholder = "Select options",
    className,
    ...rest
}: MultiSelectProps<TFieldValues>) => {
    const {
        field: { value, onChange, ...fieldProps },
        fieldState: { error },
    } = useController({ name, control, ...rest });

    const [isOpen, setIsOpen] = useState(false);
    const componentRef = useRef<HTMLDivElement>(null);
    const selectedValues: string[] = Array.isArray(value) ? value : [];
    const toggleOption = (optionValue: string) => {
        const newSelectedValues = selectedValues.includes(optionValue)
            ? selectedValues.filter((item) => item !== optionValue)
            : [...selectedValues, optionValue];
        onChange(newSelectedValues);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            componentRef.current &&
            !componentRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const displayLabels = options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label)
        .join(", ");

    return (
        <div className={`relative ${className}`} ref={componentRef}>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label}
            </label>
            <div className="mt-1 relative">
                <button
                    type="button"
                    id={name}
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...fieldProps}
                >
                    <span className="block truncate">
                        {displayLabels.length ? displayLabels : placeholder}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                            className="h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            {isOpen ? (
                                <path
                                    fillRule="evenodd"
                                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            )}
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => toggleOption(option.value)}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                            >
                                <span
                                    className={`block truncate ${selectedValues.includes(option.value) ? "font-semibold" : ""
                                        }`}
                                >
                                    {option.label}
                                </span>
                                {selectedValues.includes(option.value) && (
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 hover:text-white">
                                        <svg
                                            className="h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    );
};

export default MultiSelect;

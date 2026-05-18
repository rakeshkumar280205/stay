import { useEffect, useMemo, useRef, useState } from "react";

/**
 * LocationAutocomplete Component
 * Local suggestions dropdown for city names
 */
export const LocationAutocomplete = ({
    value,
    onChange,
    options,
    placeholder = "City or location",
    className = "",
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const filteredOptions = useMemo(() => {
        const query = value.trim().toLowerCase();
        if (!query) return options;
        return options.filter((opt) => opt.toLowerCase().includes(query));
    }, [options, value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option);
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className={className}
                autoComplete="off"
            />

            {open && filteredOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#0B1F3A] to-[#173B6C] rounded-xl shadow-2xl border-2 border-[#FF7A00]/40 max-h-64 overflow-y-auto z-50">
                    {filteredOptions.map((option, index) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left px-4 py-3 text-white transition-all duration-200 ${index === 0 ? "rounded-t-xl" : ""
                                } ${index === filteredOptions.length - 1
                                    ? "rounded-b-xl"
                                    : "border-b border-white/10"
                                } hover:bg-[#102A4C] hover:text-[#FFB366]`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            {open && filteredOptions.length === 0 && value.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[#0B1F3A] to-[#173B6C] rounded-xl shadow-2xl border-2 border-[#FF7A00]/40 px-4 py-4 text-center z-50 text-white">
                    <div className="text-sm text-white/80">No matching cities</div>
                </div>
            )}
        </div>
    );
};

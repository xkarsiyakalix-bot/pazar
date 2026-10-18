import React, { useState, useEffect, useRef, useCallback } from 'react';
import { searchBrandsAsync } from '../../utils/brandUtils';

export const BrandAutocomplete = ({
    value = '',
    onChange,
    category = null,
    label = 'Marka',
    placeholder = 'Marka ara veya yazın (örn. Astral London, Zara, Nike...)',
    required = false,
    className = ''
}) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const debounceTimer = useRef(null);

    // Sync input value with external value prop
    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Perform async search with debounce
    const performSearch = useCallback(async (text) => {
        setLoading(true);
        try {
            const results = await searchBrandsAsync(text, category, 12);
            setSuggestions(results);
        } catch (e) {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, [category]);

    const handleInputChange = (e) => {
        const text = e.target.value;
        setInputValue(text);
        setIsOpen(true);
        setHighlightedIndex(-1);

        // Immediate update to parent so custom typed brands are never lost
        if (onChange) onChange(text);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            performSearch(text);
        }, 120);
    };

    const handleFocus = () => {
        setIsOpen(true);
        performSearch(inputValue);
    };

    const selectBrand = (brandName) => {
        const trimmed = (brandName || '').trim();
        setInputValue(trimmed);
        if (onChange) onChange(trimmed);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    const handleClear = () => {
        setInputValue('');
        if (onChange) onChange('');
        setSuggestions([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                performSearch(inputValue);
            }
            return;
        }

        const totalItems = suggestions.length + (showCustomOption ? 1 : 0);

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev + 1) % totalItems);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => (prev - 1 + totalItems) % totalItems);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                selectBrand(suggestions[highlightedIndex].name);
            } else if (highlightedIndex === suggestions.length && showCustomOption) {
                selectBrand(inputValue);
            } else {
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Check if current input matches any existing suggestion exactly
    const exactMatch = suggestions.some(
        (s) => s.name?.toLowerCase().trim() === inputValue.toLowerCase().trim()
    );
    const showCustomOption = inputValue.trim().length > 0 && !exactMatch;

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 pr-10 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                />

                {/* Right action: clear button or search indicator */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {loading && (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            aria-label="Markayı Temizle"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (suggestions.length > 0 || showCustomOption) && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl max-h-72 overflow-y-auto z-50 divide-y divide-neutral-100 dark:divide-neutral-800">
                    {/* Header hint */}
                    <div className="px-3.5 py-2 text-[11px] font-semibold tracking-wider text-neutral-400 dark:text-neutral-500 uppercase bg-neutral-50/60 dark:bg-neutral-800/40">
                        {inputValue.trim() ? 'Eşleşen Markalar' : 'Popüler Markalar'}
                    </div>

                    {/* Brand Suggestions List */}
                    {suggestions.map((brand, idx) => {
                        const isHighlighted = idx === highlightedIndex;
                        return (
                            <button
                                key={`${brand.slug}-${idx}`}
                                type="button"
                                onClick={() => selectBrand(brand.name)}
                                className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${
                                    isHighlighted
                                        ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold'
                                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/70 text-neutral-900 dark:text-neutral-100'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                    <span className="truncate">{brand.name}</span>
                                </div>
                                {brand.category && (
                                    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 ml-2 flex-shrink-0">
                                        {brand.category}
                                    </span>
                                )}
                            </button>
                        );
                    })}

                    {/* Custom brand add option if not an exact match */}
                    {showCustomOption && (
                        <button
                            type="button"
                            onClick={() => selectBrand(inputValue)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-2.5 text-sm transition-colors bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 font-medium ${
                                highlightedIndex === suggestions.length ? 'bg-amber-100 dark:bg-amber-900/40' : 'hover:bg-amber-100/70 dark:hover:bg-amber-900/30'
                            }`}
                        >
                            <span className="text-base leading-none">✨</span>
                            <div className="truncate">
                                <span className="font-bold">"{inputValue.trim()}"</span> markasını özel olarak ekle
                            </div>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrandAutocomplete;


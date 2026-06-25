'use client';

import { useState, useEffect, useRef } from 'react';
import { Location } from '@/lib/types';

interface LocationInputProps {
  placeholder: string;
  value: Location | null;
  onChange: (location: Location) => void;
  icon?: 'origin' | 'destination';
}

interface SearchResult {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

export default function LocationInput({
  placeholder,
  value,
  onChange,
  icon = 'origin',
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (inputValue.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(inputValue)}`);
        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error('Geocode error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSelectResult = (result: SearchResult) => {
    onChange(result);
    setInputValue(result.name);
    setShowResults(false);
    setResults([]);
  };

  const handleFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <span
          className="material-symbols-outlined absolute left-3 text-[18px]"
          style={{ color: icon === 'origin' ? 'var(--eco-primary)' : 'var(--eco-error)' }}
        >
          {icon === 'origin' ? 'trip_origin' : 'location_on'}
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue || value?.name || ''}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full pl-10 pr-10 py-3 text-body-md border rounded-xl transition-all duration-200 focus:outline-none focus:border-[var(--eco-secondary)] focus:ring-1 focus:ring-[var(--eco-secondary)]"
          style={{
            borderColor: 'var(--eco-outline-variant)',
            background: 'var(--eco-surface-container-lowest)',
            color: 'var(--eco-on-surface)',
          }}
        />
        {isLoading && (
          <div className="absolute right-3">
            <span
              className="material-symbols-outlined animate-spin text-[18px]"
              style={{ color: 'var(--eco-on-surface-variant)' }}
            >
              progress_activity
            </span>
          </div>
        )}
      </div>
      {showResults && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{
            background: 'var(--eco-surface-container-lowest)',
            border: '0.5px solid var(--eco-outline-variant)',
          }}
        >
          {results.map((result, index) => (
            <button
              key={index}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectResult(result);
              }}
              className="w-full text-left px-4 py-3 transition-colors duration-200 hover:bg-[var(--eco-surface-container-low)]"
              style={{
                borderBottom:
                  index < results.length - 1
                    ? '0.5px solid var(--eco-outline-variant)'
                    : 'none',
              }}
            >
              <div
                className="text-data-value"
                style={{ color: 'var(--eco-on-surface)' }}
              >
                {result.name}
              </div>
              {result.address && result.address !== result.name && (
                <div
                  className="text-[11px] mt-0.5"
                  style={{ color: 'var(--eco-on-surface-variant)' }}
                >
                  {result.address}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

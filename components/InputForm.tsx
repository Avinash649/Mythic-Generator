
import React from 'react';
import type { MythOptions } from '../types';
import { SparklesIcon } from './IconComponents';

interface InputFormProps {
  options: MythOptions;
  setOptions: React.Dispatch<React.SetStateAction<MythOptions>>;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ options, setOptions, onSubmit, isLoading }) => {
  const handleInputChange = <K extends keyof MythOptions,>(key: K, value: MythOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const tones: MythOptions['tone'][] = ['epic', 'dramatic', 'humorous', 'dark'];
  const lengths: MythOptions['length'][] = ['short', 'full'];

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg border border-gray-700 sticky top-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-amber-300">
            Theme or Concept
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="theme"
              id="theme"
              className="block w-full bg-gray-900 border-gray-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm p-2 text-gray-100 placeholder-gray-400"
              placeholder="e.g., sacrifice, forbidden love"
              value={options.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-amber-300">Length</label>
            <div className="mt-2 grid grid-cols-2 gap-3">
                {lengths.map((length) => (
                    <button
                        key={length}
                        type="button"
                        onClick={() => handleInputChange('length', length)}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-all duration-200 ${
                            options.length === length
                                ? 'bg-amber-500 text-gray-900 shadow-md'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {length.charAt(0).toUpperCase() + length.slice(1)}
                    </button>
                ))}
            </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-300">Tone</label>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {tones.map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => handleInputChange('tone', tone)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none transition-all duration-200 ${
                    options.tone === tone
                        ? 'bg-amber-500 text-gray-900 shadow-md'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {tone.charAt(0).toUpperCase() + tone.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-gray-900 bg-amber-400 hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <SparklesIcon className="w-5 h-5 mr-2"/>
          {isLoading ? 'Weaving...' : 'Generate Myth'}
        </button>
      </div>
    </div>
  );
};

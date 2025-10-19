
import React from 'react';
import type { Myth } from '../types';
import { Loader } from './Loader';
import { ExpandIcon, NarrateIcon, RefreshIcon } from './IconComponents';

interface MythDisplayProps {
  myth: Myth;
  expandedPlot: string | null;
  imageUrl: string | null;
  onExpand: () => void;
  onNarrate: () => void;
  onGenerateAnother: () => void;
  isLoading: boolean;
  isNarrating: boolean;
  loadingMessage: string;
}

export const MythDisplay: React.FC<MythDisplayProps> = ({
  myth,
  expandedPlot,
  imageUrl,
  onExpand,
  onNarrate,
  onGenerateAnother,
  isLoading,
  isNarrating,
  loadingMessage
}) => {
    return (
        <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg shadow-2xl border border-gray-700 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-amber-500/50 pb-4 mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-amber-300">{myth.title}</h1>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                    <ActionButton onClick={onGenerateAnother} disabled={isLoading} icon={<RefreshIcon/>} tooltip="Generate Another"/>
                    {!expandedPlot && <ActionButton onClick={onExpand} disabled={isLoading} icon={<ExpandIcon/>} tooltip="Expand Story"/>}
                    <ActionButton onClick={onNarrate} disabled={isLoading || isNarrating} icon={<NarrateIcon/>} tooltip="Narrate Myth" isPulsing={isNarrating}/>
                </div>
            </div>

            {isLoading && <Loader message={loadingMessage}/>}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    {imageUrl && (
                        <div className="rounded-lg overflow-hidden shadow-lg border border-gray-600">
                            <img src={imageUrl} alt={`Illustration for ${myth.title}`} className="w-full h-auto object-cover" />
                        </div>
                    )}
                    
                    <MythSection title="The Legend">
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{expandedPlot || myth.plot}</p>
                    </MythSection>
                    
                    <MythSection title="Symbolism">
                        <p className="text-gray-300 leading-relaxed italic">{myth.symbolism}</p>
                    </MythSection>
                </div>

                <div className="xl:col-span-1">
                    <MythSection title="Characters">
                        <ul className="space-y-4">
                            {myth.characters.map((char) => (
                                <li key={char.name} className="p-4 bg-gray-900/60 rounded-lg border border-gray-700">
                                    <h4 className="font-bold text-amber-400">{char.name}</h4>
                                    <p className="text-sm text-gray-400 font-semibold">{char.role}</p>
                                    <p className="text-sm text-gray-300 mt-1">{char.description}</p>
                                </li>
                            ))}
                        </ul>
                    </MythSection>
                </div>
            </div>
        </div>
    );
};

const MythSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-2xl font-semibold text-amber-200 border-b border-gray-600 pb-2 mb-4">{title}</h3>
        {children}
    </div>
);

const ActionButton: React.FC<{ onClick: () => void, disabled: boolean, icon: React.ReactNode, tooltip: string, isPulsing?: boolean }> = ({ onClick, disabled, icon, tooltip, isPulsing }) => (
    <div className="relative group">
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-full bg-gray-700 hover:bg-amber-500 text-gray-300 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-gray-400 ${isPulsing ? 'animate-pulse' : ''}`}
        >
            {icon}
        </button>
        <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap -translate-x-1/2 left-1/2">
            {tooltip}
        </div>
    </div>
);

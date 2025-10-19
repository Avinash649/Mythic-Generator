
import React from 'react';
import { BookOpenIcon } from './IconComponents';

export const Header: React.FC = () => {
    return (
        <header className="text-center border-b-2 border-amber-500/30 pb-4">
            <div className="flex items-center justify-center gap-4">
                <BookOpenIcon className="w-10 h-10 text-amber-400" />
                <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                    Mythic Generator
                </h1>
            </div>
            <p className="mt-2 text-lg text-gray-300">
                Weave legends from ancient themes in the style of the Puranas.
            </p>
        </header>
    );
};

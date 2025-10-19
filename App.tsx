
import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { MythDisplay } from './components/MythDisplay';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { generateMyth, expandMyth, narrateMyth } from './services/geminiService';
import type { Myth, MythOptions } from './types';
import { decode, decodeAudioData } from './utils/audioUtils';

const App: React.FC = () => {
  const [options, setOptions] = useState<MythOptions>({
    theme: 'courage',
    length: 'short',
    tone: 'epic',
  });
  const [myth, setMyth] = useState<Myth | null>(null);
  const [expandedPlot, setExpandedPlot] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);

  const handleGenerateMyth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMyth(null);
    setImageUrl(null);
    setExpandedPlot(null);
    setLoadingMessage('Crafting a new legend...');
    
    try {
      const result = await generateMyth(options);
      setMyth(result.myth);
      setImageUrl(result.imageUrl);
    } catch (e) {
      console.error(e);
      setError('An ancient power faltered. Could not generate the myth. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [options]);

  const handleExpandStory = useCallback(async () => {
    if (!myth) return;
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Expanding the saga...');

    try {
      const fullStory = await expandMyth(myth, options.tone);
      setExpandedPlot(fullStory);
    } catch (e) {
      console.error(e);
      setError('The storyteller is lost for words. Could not expand the myth.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [myth, options.tone]);
  
  const handleNarrate = useCallback(async () => {
    if (!myth) return;
    setIsNarrating(true);
    setError(null);
    
    const textToNarrate = expandedPlot || myth.plot;
    
    try {
        const audioB64 = await narrateMyth(textToNarrate);
        const audioBytes = decode(audioB64);
        const audioBuffer = await decodeAudioData(audioBytes, audioContext, 24000, 1);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(gainNode);
        source.start();
        source.onended = () => setIsNarrating(false);
    } catch(e) {
        console.error(e);
        setError('The divine voice could not be summoned. Narration failed.');
        setIsNarrating(false);
    }
  }, [myth, expandedPlot, audioContext, gainNode]);

  const handleGenerateAnother = useCallback(() => {
    setMyth(null);
    setImageUrl(null);
    setExpandedPlot(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-4 sm:p-6 lg:p-8 font-serif">
      <div className="container mx-auto max-w-7xl">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputForm
              options={options}
              setOptions={setOptions}
              onSubmit={handleGenerateMyth}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            {isLoading && !myth && <Loader message={loadingMessage} />}
            {error && <div className="text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700">{error}</div>}
            
            {!isLoading && !myth && !error && (
              <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 rounded-lg p-8 border-2 border-dashed border-gray-600">
                  <h2 className="text-2xl font-bold text-amber-300">The Loom of Fate Awaits</h2>
                  <p className="text-gray-300 mt-2 text-center">Enter a theme, choose your path, and weave a new legend.</p>
              </div>
            )}
            
            {myth && (
              <MythDisplay
                myth={myth}
                expandedPlot={expandedPlot}
                imageUrl={imageUrl}
                onExpand={handleExpandStory}
                onNarrate={handleNarrate}
                onGenerateAnother={handleGenerateAnother}
                isLoading={isLoading}
                isNarrating={isNarrating}
                loadingMessage={loadingMessage}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

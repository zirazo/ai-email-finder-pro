import React, { useState, useCallback, useEffect } from 'react';
import { extractEmailsFromUrl } from '../services/geminiService';
import Loader from './Loader';
import { SparklesIcon, ClipboardIcon, ClipboardCheckIcon, XCircleIcon, TrashIcon, LinkIcon, HistoryIcon, ArrowDownTrayIcon } from './icons';

const MAX_HISTORY_LENGTH = 5;

const EmailExtractor: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [extractedEmails, setExtractedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Caching state
  const [cache, setCache] = useState<Map<string, string[]>>(new Map());
  const [loadedFromCache, setLoadedFromCache] = useState<boolean>(false);
  
  // History state
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Load cache and history from localStorage on component mount
  useEffect(() => {
    try {
      const storedCache = localStorage.getItem('emailExtractorCache');
      if (storedCache) {
        setCache(new Map(JSON.parse(storedCache)));
      }
      const storedHistory = localStorage.getItem('emailExtractorHistory');
      if(storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse data from localStorage:", e);
      localStorage.removeItem('emailExtractorCache');
      localStorage.removeItem('emailExtractorHistory');
    }
  }, []);

  const addToHistory = (searchUrl: string) => {
    const updatedHistory = [searchUrl, ...history.filter(item => item !== searchUrl)].slice(0, MAX_HISTORY_LENGTH);
    setHistory(updatedHistory);
    localStorage.setItem('emailExtractorHistory', JSON.stringify(updatedHistory));
  };

  const handleExtract = useCallback(async () => {
    let processedUrl = url.trim();
    if (!processedUrl) {
      setError('URL cannot be empty.');
      return;
    }

    // Prepend https:// if no protocol is present for robustness
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = 'https://' + processedUrl;
      // Update the state to reflect the auto-correction in the UI
      setUrl(processedUrl);
    }

    try {
      // Validate the URL format
      new URL(processedUrl);
    } catch (_) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    addToHistory(processedUrl);

    if (cache.has(processedUrl)) {
      const cachedEmails = cache.get(processedUrl)!;
      setExtractedEmails(cachedEmails);
      setError(cachedEmails.length === 0 ? "No public emails found for this URL (from cache)." : null);
      setLoadedFromCache(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedEmails([]);
    setIsCopied(false);
    setLoadedFromCache(false);

    try {
      const emails = await extractEmailsFromUrl(processedUrl);
      if (emails.length === 0) {
        setError("No public emails found for the provided website.");
      }
      setExtractedEmails(emails);

      const newCache = new Map(cache);
      newCache.set(processedUrl, emails);
      setCache(newCache);
      localStorage.setItem('emailExtractorCache', JSON.stringify(Array.from(newCache.entries())));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [url, cache, history]);

  const handleCopyToClipboard = useCallback(() => {
    if (extractedEmails.length > 0) {
      navigator.clipboard.writeText(extractedEmails.join('\n'));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [extractedEmails]);
  
  const handleExportEmails = useCallback(() => {
    if (extractedEmails.length > 0) {
      const fileContent = extractedEmails.join('\n');
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'extracted_emails.txt');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [extractedEmails]);

  const handleClear = () => {
    setUrl('');
    setExtractedEmails([]);
    setError(null);
    setIsCopied(false);
    setLoadedFromCache(false);
  };
  
  const selectHistoryItem = (item: string) => {
    setUrl(item);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('emailExtractorHistory');
  }

  return (
    <div className="space-y-6 relative">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl p-6">
        <label htmlFor="url-input" className="block text-lg font-medium text-slate-300 mb-2">
          Enter Website URL
        </label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <LinkIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 text-slate-300 font-mono text-sm"
              disabled={isLoading}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !isLoading && url) {
                    handleExtract();
                }
              }}
            />
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleExtract}
              disabled={isLoading || !url}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 disabled:bg-slate-500 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? <><Loader />Extracting...</> : <><SparklesIcon className="w-5 h-5 mr-2" />Extract Emails</>}
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-200"
              >
                <TrashIcon className="w-5 h-5 mr-2 sm:mr-2" />
                <span className='sm:inline'>Clear</span>
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-3 border border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-200"
                aria-label="View search history"
              >
                <HistoryIcon className="w-5 h-5" />
              </button>
            </div>
        </div>
      </div>
      
      {showHistory && (
        <div className="absolute top-full right-0 mt-2 w-full max-w-sm bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-10 animate-fade-in">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-slate-200">Recent Searches</h3>
            <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">&times;</button>
          </div>
          {history.length > 0 ? (
            <>
              <ul className="space-y-2">
                {history.map((item, index) => (
                  <li key={index} onClick={() => selectHistoryItem(item)} className="text-sky-300 font-mono text-sm p-2 bg-slate-700/50 rounded-md cursor-pointer hover:bg-slate-700 truncate">
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={clearHistory} className="text-sm text-slate-400 hover:text-red-400 w-full text-center mt-4">Clear All</button>
            </>
          ) : <p className="text-slate-400 text-sm">Your search history is empty.</p>}
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3" role="alert">
          <XCircleIcon className="w-6 h-6" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {extractedEmails.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl p-6">
          <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-slate-200">
                  Found {extractedEmails.length} Email{extractedEmails.length > 1 ? 's' : ''}
                </h2>
                {loadedFromCache && (
                    <span className="text-xs font-medium bg-slate-700 text-sky-300 px-2 py-0.5 rounded-full">Cached</span>
                )}
              </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyToClipboard}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-sky-100 bg-sky-800/50 hover:bg-sky-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 transition-all duration-200"
              >
                {isCopied ? <ClipboardCheckIcon className="w-5 h-5 mr-2" /> : <ClipboardIcon className="w-5 h-5 mr-2" />}
                {isCopied ? 'Copied!' : 'Copy All'}
              </button>
              <button
                onClick={handleExportEmails}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-sky-100 bg-sky-800/50 hover:bg-sky-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 transition-all duration-200"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Export
              </button>
            </div>
          </div>
          <ul className="bg-slate-900 p-4 rounded-lg max-h-80 overflow-y-auto space-y-2 border border-slate-600">
            {extractedEmails.map((email, index) => (
              <li key={index} className="px-3 py-2 bg-slate-800 rounded-md text-sky-300 font-mono text-sm break-all">
                {email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailExtractor;
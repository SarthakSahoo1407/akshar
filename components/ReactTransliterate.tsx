import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
} from 'react';
import getCaretCoordinates from 'textarea-caret';
import { Language } from './languages';

interface ReactTransliterateProps {
  onChangeText: (text: string) => void;
  value: string;
  renderComponent?: (props: any) => React.ReactElement;
  lang?: Language;
  maxOptions?: number;
  offsetY?: number;
  offsetX?: number;
  containerClassName?: string;
  containerStyles?: CSSProperties;
  activeItemStyles?: CSSProperties;
  hideSuggestionBoxOnMobileDevices?: boolean;
  hideSuggestionBoxBreakpoint?: number;
  className?: string; // For the inner component
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  [key: string]: any;
}


function getWordAroundCaret(text: string, caretPos: number) {
  const segment = text.substring(0, caretPos);
  // Find the last space or newline before the caret
  const match = segment.match(/[^ \n]+$/);
  
  if (match) {
    const wordStart = match.index || 0;
    const word = match[0];
    return {
      word,
      start: wordStart,
      end: caretPos,
    };
  }
  return null;
}

export const Akshar: React.FC<ReactTransliterateProps> = ({
  onChangeText,
  value,
  renderComponent = (props) => <input {...props} />,
  lang = 'hi',
  maxOptions = 5,
  offsetY = 0,
  offsetX = 0,
  containerClassName = '',
  containerStyles = {},
  activeItemStyles = {},
  hideSuggestionBoxOnMobileDevices = true,
  hideSuggestionBoxBreakpoint = 450,
  className = '',
  onKeyDown,
  onBlur,
  ...rest
}) => {
  const [options, setOptions] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState(0);
  const [caretCoords, setCaretCoords] = useState({ top: 0, left: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentWordInfo, setCurrentWordInfo] = useState<{ word: string; start: number; end: number } | null>(null);
  
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const inputRef = useRef<HTMLElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cacheRef = useRef<Record<string, string[]>>({});

  // Drive enter / exit animation
  useEffect(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (showSuggestions && options.length > 0) {
      setIsMounted(true);
      // Two rAFs: first mounts the element, second triggers the CSS transition
      requestAnimationFrame(() => requestAnimationFrame(() => setIsVisible(true)));
    } else {
      setIsVisible(false);
      animationTimeoutRef.current = setTimeout(() => setIsMounted(false), 160);
    }
  }, [showSuggestions, options.length]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchTransliteration = useCallback(
    async (word: string) => {
      // allow alphanumeric words so numbers are supported
      if (lang === 'en' || !word.trim() || !/^[A-Za-z0-9]+$/.test(word)) {
        setOptions([]);
        setShowSuggestions(false);
        return;
      }

      const cacheKey = `${lang}-${word}-${maxOptions}`;

      // Exact cache hit
      if (cacheRef.current[cacheKey]) {
        setOptions(cacheRef.current[cacheKey]);
        setActiveItem(0);
        setShowSuggestions(cacheRef.current[cacheKey].length > 0);
        return;
      }

      // Try longest cached prefix to serve suggestions instantly while we refresh in background
      let bestPrefix: string | null = null;
      for (const k in cacheRef.current) {
        const m = k.match(new RegExp(`^${lang}-(.+)-${maxOptions}$`));
        if (m) {
          const cachedWord = m[1];
          if (word.startsWith(cachedWord)) {
            if (!bestPrefix || cachedWord.length > bestPrefix.length) bestPrefix = cachedWord;
          }
        }
      }

      if (bestPrefix) {
        const cachedOptions = cacheRef.current[`${lang}-${bestPrefix}-${maxOptions}`];
        if (cachedOptions && cachedOptions.length > 0) {
          setOptions(cachedOptions);
          setActiveItem(0);
          setShowSuggestions(true);
          // Fire-and-forget refresh for the full word
          (async () => {
            try {
              if (abortControllerRef.current) abortControllerRef.current.abort();
              abortControllerRef.current = new AbortController();
              const res = await fetch(
                `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=${lang}-t-i0-und&num=${maxOptions}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`,
                { signal: abortControllerRef.current.signal }
              );
              const data = await res.json();
              if (data[0] === 'SUCCESS') {
                const fetchedOptions = data[1][0][1];
                cacheRef.current[cacheKey] = fetchedOptions;
                setOptions(fetchedOptions);
                setActiveItem(0);
                setShowSuggestions(fetchedOptions.length > 0);
              }
            } catch (err) {
              // ignore aborts/errors for background refresh
            }
          })();
          return;
        }
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const res = await fetch(
          `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=${lang}-t-i0-und&num=${maxOptions}&cp=0&cs=1&ie=utf-8&oe=utf-8&app=demopage`,
          { signal: abortControllerRef.current.signal }
        );
        const data = await res.json();
        if (data[0] === 'SUCCESS') {
          const fetchedOptions = data[1][0][1];
          cacheRef.current[cacheKey] = fetchedOptions;
          setOptions(fetchedOptions);
          setActiveItem(0);
          setShowSuggestions(fetchedOptions.length > 0);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Transliteration fetch error:', error);
          setOptions([]);
          setShowSuggestions(false);
        }
      }
    },
    [lang, maxOptions]
  );

  const calculateCaret = useCallback(() => {
    if (!inputRef.current) return;
    const el = inputRef.current as any;
    
    // Only calculate if the element is focused and has selection properties
    if (document.activeElement !== el || typeof el.selectionEnd !== 'number') return;
    
    const coords = getCaretCoordinates(el, el.selectionEnd);
    
    // Fallback line height if calculation fails
    let lineHeight = 20;
    try {
      const computedStyle = window.getComputedStyle(el);
      const computedLineHeight = parseInt(computedStyle.lineHeight, 10);
      lineHeight = isNaN(computedLineHeight) ? parseInt(computedStyle.fontSize, 10) * 1.2 : computedLineHeight;
    } catch(e) {}

    // We want the suggestions to appear just below the caret line
    setCaretCoords({
      top: coords.top + lineHeight + el.scrollTop + offsetY,
      left: coords.left + offsetX,
    });
  }, [offsetX, offsetY]);

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    onChangeText(newValue);

    // Use requestAnimationFrame to let browser update selectionEnd
    requestAnimationFrame(() => {
      calculateCaret();
      const el = inputRef.current as any;
      if (el && typeof el.selectionEnd === 'number') {
        const wordInfo = getWordAroundCaret(newValue, el.selectionEnd);
        setCurrentWordInfo(wordInfo);
        
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }

        if (wordInfo && lang !== 'en') {
          // Small debounce to batch rapid typing; tuned for responsiveness
          fetchTimeoutRef.current = setTimeout(() => {
             fetchTransliteration(wordInfo.word);
          }, 30);
        } else {
          setShowSuggestions(false);
          setOptions([]);
        }
      }
    });

    if (rest.onChange) {
      rest.onChange(e);
    }
  };

  const insertSuggestion = (suggestion: string, triggerSpace = false, trailingPunctuation = '') => {
    if (!currentWordInfo || !inputRef.current) return;
    const el = inputRef.current as any;

    const before = value.substring(0, currentWordInfo.start);
    const after = value.substring(currentWordInfo.end);
    const spaceToInsert = triggerSpace ? ' ' : '';
    
    let punctuationToInsert = trailingPunctuation;
    if (punctuationToInsert === '.') {
      const purnaviramLangs = ['hi', 'bn', 'as', 'pa', 'or', 'sa'];
      if (purnaviramLangs.includes(lang)) {
        punctuationToInsert = '।';
      }
    }
    
    const newText = before + suggestion + punctuationToInsert + spaceToInsert + after;
    onChangeText(newText);
    
    setShowSuggestions(false);
    setOptions([]);
    setCurrentWordInfo(null);

    // Calculate new caret position after insertion
    const newCaretPos = currentWordInfo.start + suggestion.length + punctuationToInsert.length + spaceToInsert.length;

    // We need to wait for react state to flush the new value to the native input before selecting range
    requestAnimationFrame(() => {
       if (inputRef.current) {
         try {
            (inputRef.current as any).setSelectionRange(newCaretPos, newCaretPos);
            inputRef.current.focus();
         } catch(e) {
           // setSelectionRange not supported on all input types (like number/email), default ignore
         }
       }
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<any>) => {
    const punctuations = ['.', ',', '?', '!', ';', ':', '-', '"', '\''];
    const purnaviramLangs = ['hi', 'bn', 'as', 'pa', 'or', 'sa'];

    if (punctuations.includes(e.key)) {
      let charToInsert = e.key;
      if (e.key === '.' && purnaviramLangs.includes(lang)) {
        charToInsert = '।';
      }

      if (showSuggestions && options.length > 0 && activeItem !== -1) {
        e.preventDefault();
        insertSuggestion(options[activeItem], false, charToInsert);
        return;
      } else if (charToInsert !== e.key) {
        e.preventDefault();
        if (inputRef.current) {
          const el = inputRef.current as any;
          const start = el.selectionStart;
          const end = el.selectionEnd;
          if (typeof start === 'number' && typeof end === 'number') {
            const before = value.substring(0, start);
            const after = value.substring(end);
            onChangeText(before + charToInsert + after);
            requestAnimationFrame(() => {
              if (inputRef.current) {
                try {
                  (inputRef.current as any).setSelectionRange(start + charToInsert.length, start + charToInsert.length);
                } catch (err) {}
              }
            });
          }
        }
        return;
      }
    }

    if (showSuggestions && options.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveItem((prev) => Math.min(prev + 1, options.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveItem((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        insertSuggestion(options[activeItem], false);
        return;
      }
      if (e.key === ' ' && activeItem !== -1) {
        e.preventDefault();
        insertSuggestion(options[activeItem], true);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    if (onKeyDown) onKeyDown(e);
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= hideSuggestionBoxBreakpoint;
  const shouldHideSuggestions = hideSuggestionBoxOnMobileDevices && isMobile;

  const componentProps = {
    ...rest,
    className,
    value,
    onChange: handleInputChange,
    onKeyDown: handleInputKeyDown,
    onBlur: (e: React.FocusEvent) => {
      // Small delay to allow click on suggestion box to complete
      setTimeout(() => {
        if (!suggestionsRef.current?.contains(document.activeElement)) {
          setShowSuggestions(false);
        }
      }, 150);
      if (onBlur) onBlur(e);
    },
    ref: inputRef,
  };

  return (
    <div 
      className={`relative flex w-full ${containerClassName}`} 
      style={containerStyles}
    >
      {renderComponent(componentProps)}

      {isMounted && !shouldHideSuggestions && (
        <div
          ref={suggestionsRef}
          className={`absolute bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 w-56 flex flex-col
            transition-[opacity,transform] duration-[140ms] ease-out origin-top-left
            ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-95 pointer-events-none'}`}
          style={{ top: caretCoords.top, left: caretCoords.left }}
        >
          {/* <div className="bg-slate-50 border-b border-slate-100 px-3 py-1.5 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggestions</span>
            <span className="text-[10px] text-blue-600 font-medium italic">{(lang && lang !== 'en') ? lang.toUpperCase() : 'HI'}</span>
          </div> */}
          <ul className="py-1 m-0 p-0 list-none max-h-[250px] overflow-y-auto">
            {options.map((option, index) => (
              <li
                key={index}
                className={`px-3 py-2 flex justify-between items-center cursor-pointer transition-[background-color,color] duration-100 ease-out ${
                  index === activeItem ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-700'
                }`}
                style={index === activeItem ? activeItemStyles : {}}
                onMouseDown={(e) => {
                  // Prevent input blur before click
                  e.preventDefault();
                }}
                onClick={() => insertSuggestion(option, true)}
                onMouseEnter={() => setActiveItem(index)}
              >
                <span className="text-lg font-medium">{option}</span>
                {/* <span className={`text-[10px] ${index === activeItem ? 'opacity-70' : 'text-slate-400'}`}>{index + 1}</span> */}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Backwards-compatible alias
export const ReactTransliterate = Akshar;

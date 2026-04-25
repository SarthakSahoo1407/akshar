var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// components/ReactTransliterate.tsx
import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import getCaretCoordinates from "textarea-caret";
function getWordAroundCaret(text, caretPos) {
  const segment = text.substring(0, caretPos);
  const match = segment.match(/[^ \n]+$/);
  if (match) {
    const wordStart = match.index || 0;
    const word = match[0];
    return {
      word,
      start: wordStart,
      end: caretPos
    };
  }
  return null;
}
var Akshar = (_a) => {
  var _b = _a, {
    onChangeText,
    value,
    renderComponent = (props) => /* @__PURE__ */ React.createElement("input", __spreadValues({}, props)),
    lang = "hi",
    maxOptions = 5,
    offsetY = 0,
    offsetX = 0,
    containerClassName = "",
    containerStyles = {},
    activeItemStyles = {},
    hideSuggestionBoxOnMobileDevices = true,
    hideSuggestionBoxBreakpoint = 450,
    className = "",
    onKeyDown,
    onBlur
  } = _b, rest = __objRest(_b, [
    "onChangeText",
    "value",
    "renderComponent",
    "lang",
    "maxOptions",
    "offsetY",
    "offsetX",
    "containerClassName",
    "containerStyles",
    "activeItemStyles",
    "hideSuggestionBoxOnMobileDevices",
    "hideSuggestionBoxBreakpoint",
    "className",
    "onKeyDown",
    "onBlur"
  ]);
  const [options, setOptions] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [caretCoords, setCaretCoords] = useState({ top: 0, left: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentWordInfo, setCurrentWordInfo] = useState(null);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const abortControllerRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const cacheRef = useRef({});
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const fetchTransliteration = useCallback(
    async (word) => {
      if (lang === "en" || !word.trim() || !/^[A-Za-z]+$/.test(word)) {
        setOptions([]);
        setShowSuggestions(false);
        return;
      }
      const cacheKey = `${lang}-${word}-${maxOptions}`;
      if (cacheRef.current[cacheKey]) {
        setOptions(cacheRef.current[cacheKey]);
        setActiveItem(0);
        setShowSuggestions(cacheRef.current[cacheKey].length > 0);
        return;
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
        if (data[0] === "SUCCESS") {
          const fetchedOptions = data[1][0][1];
          cacheRef.current[cacheKey] = fetchedOptions;
          setOptions(fetchedOptions);
          setActiveItem(0);
          setShowSuggestions(fetchedOptions.length > 0);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Transliteration fetch error:", error);
          setOptions([]);
          setShowSuggestions(false);
        }
      }
    },
    [lang, maxOptions]
  );
  const calculateCaret = useCallback(() => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    if (document.activeElement !== el || typeof el.selectionEnd !== "number") return;
    const coords = getCaretCoordinates(el, el.selectionEnd);
    let lineHeight = 20;
    try {
      const computedStyle = window.getComputedStyle(el);
      const computedLineHeight = parseInt(computedStyle.lineHeight, 10);
      lineHeight = isNaN(computedLineHeight) ? parseInt(computedStyle.fontSize, 10) * 1.2 : computedLineHeight;
    } catch (e) {
    }
    setCaretCoords({
      top: coords.top + lineHeight + el.scrollTop + offsetY,
      left: coords.left + offsetX
    });
  }, [offsetX, offsetY]);
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChangeText(newValue);
    requestAnimationFrame(() => {
      calculateCaret();
      const el = inputRef.current;
      if (el && typeof el.selectionEnd === "number") {
        const wordInfo = getWordAroundCaret(newValue, el.selectionEnd);
        setCurrentWordInfo(wordInfo);
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
        if (wordInfo && lang !== "en") {
          fetchTimeoutRef.current = setTimeout(() => {
            fetchTransliteration(wordInfo.word);
          }, 0);
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
  const insertSuggestion = (suggestion, triggerSpace = false, trailingPunctuation = "") => {
    if (!currentWordInfo || !inputRef.current) return;
    const el = inputRef.current;
    const before = value.substring(0, currentWordInfo.start);
    const after = value.substring(currentWordInfo.end);
    const spaceToInsert = triggerSpace ? " " : "";
    let punctuationToInsert = trailingPunctuation;
    if (punctuationToInsert === ".") {
      const purnaviramLangs = ["hi", "bn", "as", "pa", "or", "sa"];
      if (purnaviramLangs.includes(lang)) {
        punctuationToInsert = "\u0964";
      }
    }
    const newText = before + suggestion + punctuationToInsert + spaceToInsert + after;
    onChangeText(newText);
    setShowSuggestions(false);
    setOptions([]);
    setCurrentWordInfo(null);
    const newCaretPos = currentWordInfo.start + suggestion.length + punctuationToInsert.length + spaceToInsert.length;
    requestAnimationFrame(() => {
      if (inputRef.current) {
        try {
          inputRef.current.setSelectionRange(newCaretPos, newCaretPos);
          inputRef.current.focus();
        } catch (e) {
        }
      }
    });
  };
  const handleInputKeyDown = (e) => {
    const punctuations = [".", ",", "?", "!", ";", ":", "-", '"', "'"];
    const purnaviramLangs = ["hi", "bn", "as", "pa", "or", "sa"];
    if (punctuations.includes(e.key)) {
      let charToInsert = e.key;
      if (e.key === "." && purnaviramLangs.includes(lang)) {
        charToInsert = "\u0964";
      }
      if (showSuggestions && options.length > 0 && activeItem !== -1) {
        e.preventDefault();
        insertSuggestion(options[activeItem], false, charToInsert);
        return;
      } else if (charToInsert !== e.key) {
        e.preventDefault();
        if (inputRef.current) {
          const el = inputRef.current;
          const start = el.selectionStart;
          const end = el.selectionEnd;
          if (typeof start === "number" && typeof end === "number") {
            const before = value.substring(0, start);
            const after = value.substring(end);
            onChangeText(before + charToInsert + after);
            requestAnimationFrame(() => {
              if (inputRef.current) {
                try {
                  inputRef.current.setSelectionRange(start + charToInsert.length, start + charToInsert.length);
                } catch (err) {
                }
              }
            });
          }
        }
        return;
      }
    }
    if (showSuggestions && options.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveItem((prev) => Math.min(prev + 1, options.length - 1));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveItem((prev) => Math.max(prev - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        insertSuggestion(options[activeItem], false);
        return;
      }
      if (e.key === " " && activeItem !== -1) {
        e.preventDefault();
        insertSuggestion(options[activeItem], true);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }
    if (onKeyDown) onKeyDown(e);
  };
  const isMobile = typeof window !== "undefined" && window.innerWidth <= hideSuggestionBoxBreakpoint;
  const shouldHideSuggestions = hideSuggestionBoxOnMobileDevices && isMobile;
  const componentProps = __spreadProps(__spreadValues({}, rest), {
    className,
    value,
    onChange: handleInputChange,
    onKeyDown: handleInputKeyDown,
    onBlur: (e) => {
      setTimeout(() => {
        var _a2;
        if (!((_a2 = suggestionsRef.current) == null ? void 0 : _a2.contains(document.activeElement))) {
          setShowSuggestions(false);
        }
      }, 150);
      if (onBlur) onBlur(e);
    },
    ref: inputRef
  });
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: `relative flex w-full ${containerClassName}`,
      style: containerStyles
    },
    renderComponent(componentProps),
    showSuggestions && options.length > 0 && !shouldHideSuggestions && /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: suggestionsRef,
        className: "absolute bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50 w-56 flex flex-col",
        style: { top: caretCoords.top, left: caretCoords.left }
      },
      /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 border-b border-slate-100 px-3 py-1.5 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider" }, "Suggestions"), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-blue-600 font-medium italic" }, lang && lang !== "en" ? lang.toUpperCase() : "HI")),
      /* @__PURE__ */ React.createElement("ul", { className: "py-1 m-0 p-0 list-none max-h-[250px] overflow-y-auto" }, options.map((option, index) => /* @__PURE__ */ React.createElement(
        "li",
        {
          key: index,
          className: `px-3 py-2 flex justify-between items-center cursor-pointer transition-colors ${index === activeItem ? "bg-blue-600 text-white" : "hover:bg-slate-50 text-slate-700"}`,
          style: index === activeItem ? activeItemStyles : {},
          onMouseDown: (e) => {
            e.preventDefault();
          },
          onClick: () => insertSuggestion(option, true),
          onMouseEnter: () => setActiveItem(index)
        },
        /* @__PURE__ */ React.createElement("span", { className: "text-lg font-medium" }, option),
        /* @__PURE__ */ React.createElement("span", { className: `text-[10px] ${index === activeItem ? "opacity-70" : "text-slate-400"}` }, index + 1)
      )))
    )
  );
};

// components/languages.ts
var languageMap = {
  en: "english",
  hi: "hindi",
  ta: "tamil",
  te: "telugu",
  or: "odia",
  bn: "bengali",
  mr: "marathi",
  ml: "malayalam",
  kn: "kannada",
  as: "assamese",
  gu: "gujarati",
  ur: "urdu",
  pa: "punjabi",
  sa: "sanskrit"
};
var languageList = Object.entries(languageMap).map(([code, name]) => ({
  code,
  name
}));
export {
  Akshar,
  Akshar as ReactTransliterate,
  languageList,
  languageMap
};
//# sourceMappingURL=index.mjs.map
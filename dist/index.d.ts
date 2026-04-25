import React, { CSSProperties } from 'react';

declare const languageMap: {
    en: string;
    hi: string;
    ta: string;
    te: string;
    or: string;
    bn: string;
    mr: string;
    ml: string;
    kn: string;
    as: string;
    gu: string;
    ur: string;
    pa: string;
    sa: string;
};
type Language = keyof typeof languageMap;
declare const languageList: {
    code: Language;
    name: string;
}[];

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
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onBlur?: (e: React.FocusEvent) => void;
    [key: string]: any;
}
declare const Akshar: React.FC<ReactTransliterateProps>;

export { Akshar, type Language, Akshar as ReactTransliterate, languageList, languageMap };

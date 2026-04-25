<div align="center">
  <!-- <img width="1200" height="475" alt="Akshar Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /> -->

  <h1>Akshar</h1>
  <p>Indic transliteration for React — powered by Google Input Tools</p>

  <p>
    <a href="https://www.npmjs.com/package/akshar"><img src="https://img.shields.io/npm/v/akshar?color=blue&style=flat-square" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/akshar"><img src="https://img.shields.io/npm/dm/akshar?style=flat-square" alt="downloads" /></a>
    <a href="https://github.com/yourusername/akshar/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/akshar?style=flat-square" alt="MIT" /></a>
    <a href="https://bundlephobia.com/package/akshar"><img src="https://img.shields.io/bundlephobia/minzip/akshar?style=flat-square" alt="bundle size" /></a>
  </p>
</div>

---

**Akshar** is a lightweight React component that converts phonetically typed English text into Indic scripts in real time — supporting Hindi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Urdu, Sanskrit, and more.

## Features

- Type `namaste` → get `नमस्ते` instantly
- Works with any `<input>` or `<textarea>` via `renderComponent`
- Keyboard-first navigation (↑↓ / Space / Esc)
- Prefix-cache for instant suggestions while typing (like Google Indic Input)
- Supports numbers in transliteration
- TypeScript ready, zero config

---

## Installation

```bash
npm install akshar-typing
# or
yarn add akshar-typing
# or
pnpm add akshar-typing
```

---

## Quick Start

```tsx
import { useState } from "react";
import { Akshar } from "akshar-typing";

export default function Editor() {
  const [text, setText] = useState("");

  return (
    <Akshar
      lang="hi"
      value={text}
      onChangeText={setText}
    />
  );
}
```

---

## With a custom textarea

```tsx
<Akshar
  lang="hi"
  value={text}
  onChangeText={setText}
  maxOptions={5}
  offsetY={8}
  renderComponent={(props) => (
    <textarea
      {...props}
      className="my-editor"
      placeholder="Type in phonetic English…"
    />
  )}
/>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lang` | `Language` | `"hi"` | Target language code |
| `value` | `string` | — | Controlled text value |
| `onChangeText` | `(text: string) => void` | — | Called on every change |
| `renderComponent` | `(props) => ReactElement` | `<input>` | Custom input renderer |
| `maxOptions` | `number` | `5` | Max suggestions to show |
| `offsetY` | `number` | `0` | Vertical popup offset (px) |
| `offsetX` | `number` | `0` | Horizontal popup offset (px) |
| `containerClassName` | `string` | `""` | CSS class for the wrapper div |
| `containerStyles` | `CSSProperties` | `{}` | Inline styles for wrapper |
| `activeItemStyles` | `CSSProperties` | `{}` | Inline styles for highlighted suggestion |
| `hideSuggestionBoxOnMobileDevices` | `boolean` | `true` | Hide suggestions on small screens |
| `hideSuggestionBoxBreakpoint` | `number` | `450` | Width breakpoint (px) for hiding |

---

## Supported Languages

| Code | Language  |
|------|-----------|
| `hi` | Hindi     |
| `bn` | Bengali   |
| `ta` | Tamil     |
| `te` | Telugu    |
| `ml` | Malayalam |
| `kn` | Kannada   |
| `mr` | Marathi   |
| `gu` | Gujarati  |
| `pa` | Punjabi   |
| `ur` | Urdu      |
| `sa` | Sanskrit  |
| `or` | Odia      |
| `as` | Assamese  |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Accept suggestion and add space |
| `Tab` | Accept suggestion |
| `↑` / `↓` | Navigate suggestions |
| `Enter` | Accept suggestion |
| `Esc` | Dismiss suggestions |

---

## Development

```bash
git clone https://github.com/yourusername/akshar
cd akshar
npm install
npm run dev        # start Next.js demo
npm run build:lib  # build the library (tsup)
npm run build      # build library + Next.js
```

---

## Publishing

CI publishing is handled automatically via GitHub Actions on a version tag push:

```bash
npm version patch   # or minor / major
git push origin v1.x.x
```

See [`.github/workflows/publish.yml`](.github/workflows/publish.yml) — requires `NPM_TOKEN` as a repository secret.

---

## License

MIT © 2026 Akshar

Steps:

1. Create an npm automation token on https://www.npmjs.com/settings/<your-username>/tokens (type: Automation).
2. Add the token as `NPM_TOKEN` in your repository's Settings → Secrets → Actions.
3. Tag and push a release to trigger CI:

```bash
git tag v1.0.1
git push origin v1.0.1
```

The workflow will run `npm run build` and `npm publish --access public` using the provided token.

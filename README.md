# Autocomplete

## 🚀 Install / Setup / Launch

- Using node v20.9.0 
- npm or yarn

```bash
npm install

# Dev mode
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🛠️ Tools, libraries

- **React** + **TypeScript** + **Vite**
- **Tailwind** - just to speed up the few styles needed
- **Wikipedia API** - for the tennis players data
- **qs** - builds query strings

## 🧱 How it works
- **Wikipedia API** - for real data, debounced 300ms + fake 500ms delay 
- **Performance** - memo, useMemo, refs for scrolling
- **UX** - arrow keys ⬆/⬇️ to navigate through results, enter/click selects a player

## 🏗️ Structure

```
src/
├── components/          # searchInput.tsx, searchResults.tsx
├── hooks/               # useSearch.ts, useKeyboardNavigation.ts  
├── services/            # factory.ts, types.ts
└── lib/                 # utils.ts
```


## 🎯 Shortcuts

- **hardcoded delays** - `delay(500)`, `setTimeout(300)` because wiki API is super fast
- **vite proxy** - quick CORS fix
- **Tailwind** - requirements said "basic CSS", so I used this for speed
- **text highlighting** - wrote my own instead of adding more libs

## 💡 Next

Could fetch player details on selection using the pageid:
```js
// When user selects a player, get full bio
`/w/api.php?action=query&pageids=${pageid}&exintro=true&explaintext=true&prop=extracts`

// exampler response:

{
"55830838": {
    // ...other
    "pageid": 55830838,
    "title": "Franco Agamenone",
    "fullurl": "https://en.wikipedia.org/wiki/Franco_Agamenone",
    "canonicalurl": "https://en.wikipedia.org/wiki/Franco_Agamenone",
    "extract": "Franco Agamenone (born 15 April 1993) is an Italian–Argentine tennis player..."
}

```
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_REMOTE_BASE: string;
    // add more env vars here as needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
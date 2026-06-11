/// <reference types="vite/client" />

interface Window {
  electron: {
    getPCName: () => Promise<string>;
    selectFolder: (defaultPath?: string) => Promise<string | null>;
    openFolder: (folderPath: string) => Promise<void>;
  }
}
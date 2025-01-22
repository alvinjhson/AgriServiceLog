/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string; 
    readonly VITE_API_RESETPASSWORD: string; 
    readonly API_REQUEST_PASSWORD_RESET: string;
    readonly API_MACHINES: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_LOGIN: string;
    readonly VITE_API_RESETPASSWORD: string;
    readonly VITE_API_REQUEST_PASSWORD_RESET: string;
    readonly VITE_API_MACHINES: string;
    readonly VITE_API_SIGNUP: string;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_FRONTEND_BASE_URL: string;
    readonly VITE_SOURCE_EMAIL: string;
    readonly VITE_JWT_SECRET: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
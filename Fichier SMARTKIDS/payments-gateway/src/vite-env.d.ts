/// <reference types="vite/client" />

declare global {
    interface Window { ReactNativeWebView: unknown; }
}

window.ReactNativeWebView = window.ReactNativeWebView || {};
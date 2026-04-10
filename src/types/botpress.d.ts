export {};

declare global {
  interface Window {
    botpressWebChat?: {
      init: (config: Record<string, any>) => void;
      open?: () => void;
      close?: () => void;
      toggle?: () => void;
      sendEvent?: (event: { type: string }) => void;
    };
  }
}

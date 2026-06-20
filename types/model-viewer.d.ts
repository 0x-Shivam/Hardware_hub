declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerElement;
    }
  }
}

interface ModelViewerElement extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  src?: string;
  alt?: string;
  'camera-controls'?: boolean;
  'auto-rotate'?: boolean;
  'shadow-intensity'?: string;
  autoplay?: boolean;
  'interaction-prompt'?: 'auto' | 'when-focused' | 'none';
}

export {};

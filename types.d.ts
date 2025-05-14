declare module '@mkkellogg/gaussian-splats-3d' {
  export class SplatLoader {
    constructor();
    loadAsync(url: string): Promise<THREE.Object3D>;
  }
}

declare module 'qr-scanner' {
  export interface QrScannerOptions {
    returnDetailedScanResult?: boolean;
    highlightScanRegion?: boolean;
    highlightCodeOutline?: boolean;
    preferredCamera?: string;
  }

  export interface QrScannerResult {
    data: string;
  }

  export default class QrScanner {
    constructor(
      videoElem: HTMLVideoElement,
      onDecode: (result: QrScannerResult) => void,
      options?: QrScannerOptions
    );
    
    static hasCamera(): Promise<boolean>;
    static scanImage(file: File | Blob | HTMLImageElement | string): Promise<QrScannerResult>;
    start(): Promise<void>;
    stop(): void;
    destroy(): void;
  }
}

declare module 'mind-ar-js' {
  export class MindARThree {
    constructor(options: any);
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    start(): Promise<void>;
    stop(): void;
    addAnchor(index: number): any;
  }
} 
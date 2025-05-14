'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SplatLoader } from '@mkkellogg/gaussian-splats-3d';
// @ts-ignore
import { MindARThree } from 'mind-ar-js';

interface ARViewerProps {
  modelPath: string;
  targetImagePath: string;
}

const ARViewer: React.FC<ARViewerProps> = ({ modelPath, targetImagePath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const splatRef = useRef<any>(null);
  const arSystemRef = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanCompleted, setScanCompleted] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Função para inicializar AR
    const initAR = async () => {
      try {
        setIsLoading(true);
        
        // Garantir que o containerRef.current não é null
        if (!containerRef.current) return;
        
        // Criar sistema AR
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: targetImagePath,
          filterMinCF: 0.0001,
          filterBeta: 0.001,
          missTolerance: 5,
          warmupTolerance: 5,
          uiScanning: "#scanning-overlay",
          uiLoading: "#loading-overlay"
        });
        arSystemRef.current = mindarThree;

        // Obter a cena e câmara do MindAR
        const { scene, renderer, camera } = mindarThree;
        sceneRef.current = scene;
        rendererRef.current = renderer;
        cameraRef.current = camera;

        // Configurar tamanho do renderer
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Adicionar luz ambiente
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Criar anchor para posicionar o modelo
        const anchor = mindarThree.addAnchor(0);
        
        // Carregar o modelo Gaussian Splat
        const loader = new SplatLoader();
        const splat = await loader.loadAsync(modelPath);
        
        if (splat) {
          // Ajustar escala e posição do splat
          splat.scale.set(0.05, 0.05, 0.05); // Ajuste conforme necessário
          splat.position.set(0, 0, 0); // Ajuste conforme necessário
          anchor.group.add(splat);
          splatRef.current = splat;
          
          // Evento quando o marcador é encontrado
          anchor.onTargetFound = () => {
            setScanCompleted(true);
            console.log("Target found");
          };
          
          // Evento quando o marcador é perdido
          anchor.onTargetLost = () => {
            console.log("Target lost");
          };
        }
        
        await mindarThree.start();
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao inicializar AR:', err);
        setError('Não foi possível inicializar o sistema de Realidade Aumentada.');
        setIsLoading(false);
      }
    };

    initAR();

    // Ajustar tamanho ao redimensionar a janela
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      if (cameraRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (arSystemRef.current) {
        arSystemRef.current.stop();
      }
    };
  }, [modelPath, targetImagePath]);

  return (
    <div className="ar-viewer-container">
      {isLoading && (
        <div className="loading-overlay" id="loading-overlay">
          <div className="spinner"></div>
          <p>A inicializar realidade aumentada...</p>
        </div>
      )}
      
      {!scanCompleted && !isLoading && (
        <div className="scanning-overlay" id="scanning-overlay">
          <div className="scanning-box"></div>
          <p>Aponte a câmara para a imagem ou código QR</p>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      )}
      
      <div ref={containerRef} className="ar-container" />
      
      <style jsx>{`
        .ar-viewer-container {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 300px;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .ar-container {
          width: 100%;
          height: 100%;
        }
        
        .loading-overlay, .error-overlay, .scanning-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          z-index: 10;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          margin-bottom: 10px;
        }
        
        .scanning-box {
          width: 200px;
          height: 200px;
          border: 2px solid #4CAF50;
          border-radius: 8px;
          position: relative;
          margin-bottom: 20px;
        }
        
        .scanning-box::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid #4CAF50;
          border-radius: 8px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ARViewer;

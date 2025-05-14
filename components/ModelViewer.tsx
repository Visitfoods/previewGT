'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SplatLoader } from '@mkkellogg/gaussian-splats-3d';

interface ModelViewerProps {
  modelPath: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const splatRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Inicializar Three.js
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Criar cena, câmara e renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Adicionar controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    // Adicionar luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Carregar o modelo Gaussian Splat
    const loadModel = async () => {
      try {
        setIsLoading(true);
        
        // Carregar o modelo usando a biblioteca Gaussian Splats 3D
        const loader = new SplatLoader();
        const splat = await loader.loadAsync(modelPath);
        
        if (splat) {
          scene.add(splat);
          splatRef.current = splat;
          
          // Ajustar a câmara para enquadrar o modelo
          const box = new THREE.Box3().setFromObject(splat);
          const center = new THREE.Vector3();
          box.getCenter(center);
          
          const size = new THREE.Vector3();
          box.getSize(size);
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = camera.fov * (Math.PI / 180);
          const cameraDistance = maxDim / (2 * Math.tan(fov / 2));
          
          camera.position.copy(center);
          camera.position.z += cameraDistance * 1.5;
          camera.lookAt(center);
          
          controls.target.copy(center);
          controls.update();
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar o modelo:', err);
        setError('Não foi possível carregar o modelo 3D.');
        setIsLoading(false);
      }
    };

    loadModel();

    // Função de animação
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Ajustar tamanho ao redimensionar a janela
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [modelPath]);

  return (
    <div className="model-viewer-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>A carregar modelo 3D...</p>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      )}
      
      <div ref={containerRef} className="canvas-container" />
      
      <style jsx>{`
        .model-viewer-container {
          position: relative;
          width: 100%;
          height: 60vh;
          min-height: 300px;
        }
        
        .canvas-container {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .loading-overlay, .error-overlay {
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
          border-radius: 8px;
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

export default ModelViewer; 
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SplatLoader } from '@mkkellogg/gaussian-splats-3d';
import { trackEvent, measureFPS, useAnalytics } from './Analytics';

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
  const animationFrameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Inicializar o sistema de análise
  useAnalytics(isLowPerformance);

  // Detetar dispositivos de baixa capacidade
  useEffect(() => {
    const detectLowPerformance = () => {
      // Verificar se é um dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Verificar a quantidade de RAM disponível (quando suportado)
      const lowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;
      
      // Verificar a quantidade de núcleos de CPU (quando suportado)
      const lowCPU = 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4;
      
      // Verificar se o navegador suporta WebGL2
      const canvas = document.createElement('canvas');
      const hasWebGL2 = !!window.WebGL2RenderingContext && !!canvas.getContext('webgl2');
      
      return isMobile || lowMemory || lowCPU || !hasWebGL2;
    };
    
    const isLowPerf = detectLowPerformance();
    setIsLowPerformance(isLowPerf);
    
    // Rastrear informações do dispositivo
    trackEvent('performance', 'deviceDetection', {
      isLowPerformance: isLowPerf,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      hasWebGL2: !!window.WebGL2RenderingContext && !!document.createElement('canvas').getContext('webgl2'),
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: 'deviceMemory' in navigator ? (navigator as any).deviceMemory : 'unknown'
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Registrar início do carregamento
    const startTime = performance.now();
    trackEvent('modelView', 'loadStart', { modelPath });

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

    // Configurar o renderer com base no desempenho do dispositivo
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isLowPerformance, // Desativar antialias em dispositivos de baixa capacidade
      powerPreference: isLowPerformance ? 'low-power' : 'high-performance'
    });
    
    // Reduzir a resolução em dispositivos de baixa capacidade
    const pixelRatio = isLowPerformance ? Math.min(1.0, window.devicePixelRatio) : window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height);
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Adicionar controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isLowPerformance; // Desativar amortecimento em dispositivos de baixa capacidade
    controls.dampingFactor = 0.25;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;
    controls.rotateSpeed = isLowPerformance ? 0.5 : 1.0; // Reduzir a velocidade de rotação
    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Adicionar luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Rastrear interações do utilizador
    const trackInteraction = (type: string) => {
      trackEvent('interaction', type, { modelPath });
    };

    controls.addEventListener('start', () => trackInteraction('controlsStart'));
    controls.addEventListener('end', () => trackInteraction('controlsEnd'));
    controls.addEventListener('change', () => trackInteraction('controlsChange'));

    // Carregar o modelo Gaussian Splat
    const loadModel = async () => {
      try {
        setIsLoading(true);
        
        // Carregar o modelo usando a biblioteca Gaussian Splats 3D
        const loader = new SplatLoader();
        const splat = await loader.loadAsync(modelPath);
        
        if (splat) {
          // Se for um dispositivo de baixa capacidade, reduza a escala do modelo
          if (isLowPerformance && splat.userData && splat.userData.splatScale) {
            // Reduzir a escala do splat para melhorar o desempenho
            splat.userData.splatScale *= 0.8;
          }
          
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
        
        // Rastrear tempo de carregamento
        const loadTime = performance.now() - startTime;
        trackEvent('modelView', 'loadComplete', { 
          modelPath,
          loadTimeMs: loadTime,
          hasLowPerformanceMode: isLowPerformance
        });
      } catch (err) {
        console.error('Erro ao carregar o modelo:', err);
        setError('Não foi possível carregar o modelo 3D.');
        setIsLoading(false);
        
        // Rastrear erro de carregamento
        trackEvent('error', 'modelLoadError', { 
          modelPath, 
          error: err instanceof Error ? err.message : String(err)
        });
      }
    };

    loadModel();

    // Variável para controlar o framerate
    let lastTime = 0;
    const targetFPS = isLowPerformance ? 30 : 60;
    const frameInterval = 1000 / targetFPS;

    // Função de animação otimizada
    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      // Medição de FPS para analíticas
      measureFPS(time);
      
      // Limitar o framerate em dispositivos de baixa capacidade
      const delta = time - lastTime;
      if (delta < frameInterval && isLowPerformance) return;
      
      lastTime = time - (delta % frameInterval);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Ajustar tamanho ao redimensionar a janela - com debounce para melhorar desempenho
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        
        rendererRef.current.setSize(width, height);
        
        // Rastrear evento de redimensionamento
        trackEvent('interaction', 'resize', {
          width,
          height,
          devicePixelRatio: window.devicePixelRatio
        });
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    // Otimizar para desempenho em dispositivos móveis
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pausa a renderização quando a página não está visível
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        trackEvent('interaction', 'visibilityHidden');
      } else {
        // Reinicia a renderização quando a página fica visível novamente
        if (animationFrameRef.current === null) {
          lastTime = 0;
          animationFrameRef.current = requestAnimationFrame(animate);
          trackEvent('interaction', 'visibilityVisible');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (controls) {
        controls.removeEventListener('start', () => trackInteraction('controlsStart'));
        controls.removeEventListener('end', () => trackInteraction('controlsEnd'));
        controls.removeEventListener('change', () => trackInteraction('controlsChange'));
      }
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && rendererRef.current.domElement && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      trackEvent('modelView', 'unmounted', { modelPath });
    };
  }, [modelPath, isLowPerformance]);

  // Rastrear interações de clique no componente
  const handleContainerClick = () => {
    trackEvent('interaction', 'containerClick', { modelPath });
  };

  return (
    <div className="model-viewer-container" onClick={handleContainerClick}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>A carregar modelo 3D...</p>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={() => {
            window.location.reload();
            trackEvent('interaction', 'retryButtonClick');
          }}>Tentar novamente</button>
        </div>
      )}
      
      <div ref={containerRef} className="canvas-container" />
      
      {isLowPerformance && !isLoading && !error && (
        <div className="performance-notice">
          <p>Modo de desempenho otimizado ativado</p>
        </div>
      )}
      
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
        
        .performance-notice {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background-color: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          z-index: 5;
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
'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ARViewerProps {
  modelPath: string;
}

declare global {
  interface Window {
    MINDAR: any;
    MindARThree: any; // Alternativa para versões mais antigas
    mindar: any; // Outra possível alternativa
  }
}

const ARViewer: React.FC<ARViewerProps> = ({ modelPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mindarThreeRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptStarted, setIsScriptStarted] = useState(false);

  // Carregar o script MindAR manualmente
  useEffect(() => {
    if (isScriptLoaded) return;

    const loadMindARScript = () => {
      // Remover qualquer script anterior para evitar conflitos
      const oldScripts = document.querySelectorAll('script[src*="mind-ar"]');
      oldScripts.forEach(script => script.parentNode?.removeChild(script));

      // Carregar versão UMD da biblioteca (não módulo)
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.0/dist/mindar-image-three.prod.js';
      script.async = true;
      
      script.onload = () => {
        console.log('Script MindAR carregado manualmente');
        
        // Verificar se o objeto global MINDAR foi criado
        if (window.MINDAR || window.MindARThree || window.mindar) {
          console.log('Objeto MINDAR encontrado em:', {
            MINDAR: !!window.MINDAR,
            MindARThree: !!window.MindARThree,
            mindar: !!window.mindar
          });
          setIsScriptLoaded(true);
        } else {
          console.error('Script carregado mas MINDAR não encontrado na window');
          setError('Biblioteca AR carregada mas não inicializada corretamente');
        }
      };
      
      script.onerror = (e) => {
        console.error('Erro ao carregar script MindAR:', e);
        setError('Falha ao carregar biblioteca AR');
      };
      
      document.body.appendChild(script);
    };
    
    loadMindARScript();
    
    return () => {
      // Limpar scripts ao desmontar o componente
      const scripts = document.querySelectorAll('script[src*="mind-ar"]');
      scripts.forEach(script => script.parentNode?.removeChild(script));
    };
  }, []);

  // Função para obter a API MindAR independentemente de onde ela esteja disponível
  const getMindARAPI = () => {
    if (window.MINDAR) return window.MINDAR;
    if (window.MindARThree) return { MindARThree: window.MindARThree };
    if (window.mindar) return window.mindar;
    return null;
  };

  useEffect(() => {
    const startAR = async () => {
      try {
        if (!containerRef.current) {
          console.log('Container não disponível');
          return;
        }

        // Obter a API MindAR
        const mindARAPI = getMindARAPI();
        if (!mindARAPI) {
          throw new Error('API MindAR não disponível');
        }

        console.log('MindAR API disponível:', mindARAPI);
        console.log('Iniciando AR com modelo:', modelPath);

        // Determinar qual API usar
        const MindARThreeClass = mindARAPI.MindARThree || window.MindARThree;
        
        if (!MindARThreeClass) {
          throw new Error('Classe MindARThree não encontrada');
        }

        // Inicializar MindAR com o target.mind
        const mindarThree = new MindARThreeClass({
          container: containerRef.current,
          imageTargetSrc: '/targets/target.mind',
          uiScanning: true,
          uiLoading: true,
          filterMinCF: 0.0001,
          filterBeta: 10,
          warmupTolerance: 5,
          missTolerance: 5,
        });

        console.log('MindAR inicializado');

        const { renderer, scene, camera } = mindarThree;
        sceneRef.current = scene;

        // Configurar iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);

        console.log('Carregando modelo GLB:', modelPath);

        // Carregar o modelo GLB
        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf) => {
            console.log('Modelo GLB carregado com sucesso');
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);
            model.position.set(0, 0, 0);
            model.rotation.x = -Math.PI / 2;

            // Adicionar o modelo ao anchor do MindAR
            const anchor = mindarThree.addAnchor(0);
            anchor.group.add(model);
            modelRef.current = model;

            setIsLoading(false);
            setIsScriptStarted(true);
          },
          (progress) => {
            console.log('Progresso do carregamento:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
          },
          (error) => {
            console.error('Erro ao carregar modelo:', error);
            setError('Falha ao carregar o modelo 3D');
            setIsLoading(false);
          }
        );

        console.log('Iniciando experiência AR');

        // Iniciar experiência AR
        await mindarThree.start();
        mindarThreeRef.current = mindarThree;

        console.log('Experiência AR iniciada com sucesso');

        // Função de renderização
        renderer.setAnimationLoop(() => {
          if (modelRef.current) {
            modelRef.current.rotation.z += 0.005;
          }
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error('Erro ao iniciar AR:', err);
        setError(`Falha ao iniciar a experiência AR: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    if (isScriptLoaded && !isScriptStarted) {
      console.log('Script MindAR carregado, iniciando AR');
      startAR();
    }

    return () => {
      if (mindarThreeRef.current) {
        console.log('Parando experiência AR');
        mindarThreeRef.current.stop();
      }
    };
  }, [modelPath, isScriptLoaded, isScriptStarted]);

  const handleRetry = () => {
    // Recarregar apenas o componente
    setIsLoading(true);
    setError(null);
    setIsScriptLoaded(false);
    setIsScriptStarted(false);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          zIndex: 1000
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #4CAF50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }} />
          <p>A carregar experiência AR...</p>
          <p style={{ fontSize: '14px', color: '#aaa', marginTop: '5px' }}>
            Certifique-se de permitir o acesso à câmara quando solicitado.
          </p>
          {error && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              borderRadius: '5px',
              textAlign: 'center',
              maxWidth: '80%'
            }}>
              <p style={{ margin: 0, color: '#ff6b6b' }}>{error}</p>
              <button
                onClick={handleRetry}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ARViewer;
 
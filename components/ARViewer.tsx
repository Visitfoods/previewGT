'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface ARViewerProps {
  modelPath: string;
}

// Declaração para o objeto global Window
declare global {
  interface Window {
    MINDAR: {
      IMAGE: {
        Three: any;
      };
    };
  }
}

const ARViewer: React.FC<ARViewerProps> = ({ modelPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const mindarThreeRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScript = () => {
      // Remover qualquer script antigo para evitar conflitos
      const oldScripts = document.querySelectorAll('script[src*="mind-ar"]');
      oldScripts.forEach(script => script.parentNode?.removeChild(script));

      // Criar e carregar o novo script
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.1.4/dist/mindar-image-three.prod.js';
      script.async = true;
      scriptRef.current = script;
      
      script.onload = () => {
        console.log('Script carregado. Verificando MINDAR:', window.MINDAR);
        
        // Aguardar um pouco para garantir que a biblioteca esteja inicializada
        setTimeout(() => {
          if (window.MINDAR && window.MINDAR.IMAGE) {
            console.log('MindAR disponível. Iniciando AR...');
            startAR();
          } else {
            console.error('MindAR não disponível após timeout:', window.MINDAR);
            setError('Biblioteca MindAR não carregada corretamente');
            setIsLoading(false);
          }
        }, 1000); // Aumentei para 1000ms para garantir mais tempo de inicialização
      };
      
      script.onerror = (e) => {
        console.error('Erro ao carregar script MindAR:', e);
        setError('Falha ao carregar biblioteca AR. Verifica a tua conexão à internet.');
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
    };

    const startAR = async () => {
      try {
        if (!containerRef.current) {
          throw new Error('Container não disponível');
        }

        console.log('Iniciando AR com modelo:', modelPath);

        // Inicializar MindAR
        const mindarThree = new window.MINDAR.IMAGE.Three({
          container: containerRef.current,
          imageTargetSrc: '/targets/target.mind',
          uiScanning: true,
          uiLoading: true,
          maxTrack: 1
        });

        console.log('MindAR inicializado');
        mindarThreeRef.current = mindarThree;

        const { renderer, scene, camera } = mindarThree;

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

            setIsLoading(false);
          },
          (progress) => {
            console.log('Progresso do carregamento:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
          },
          (error) => {
            console.error('Erro ao carregar modelo:', error);
            setError('Falha ao carregar o modelo 3D. Verifica se o caminho está correto.');
            setIsLoading(false);
          }
        );

        console.log('Iniciando experiência AR');

        // Iniciar experiência AR
        await mindarThree.start();
        console.log('Experiência AR iniciada com sucesso');

        // Função de renderização
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error('Erro ao iniciar AR:', err);
        setError(`Falha ao iniciar a experiência AR: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    // Carregar o script
    loadScript();

    // Limpeza ao desmontar o componente
    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
      
      if (mindarThreeRef.current) {
        console.log('Parando experiência AR');
        mindarThreeRef.current.stop();
      }
    };
  }, [modelPath]);

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
            Certifica-te de permitir o acesso à câmara quando solicitado.
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
                onClick={() => window.location.reload()}
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
 
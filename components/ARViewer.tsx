'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MindARThree } from '@mind-ar/web';

interface ARViewerProps {
  modelPath: string;
}

const ARViewer: React.FC<ARViewerProps> = ({ modelPath }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mindarThreeRef = useRef<any>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startAR = async () => {
      try {
        if (!containerRef.current) return;

        // Inicializar MindAR com o target.mind
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: '/targets/target.mind',
          uiScanning: true,
          uiLoading: true,
        });

        const { renderer, scene, camera } = mindarThree;
        sceneRef.current = scene;

        // Configurar iluminação
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 0);
        scene.add(directionalLight);

        // Carregar o modelo GLB
        const loader = new GLTFLoader();
        loader.load(
          modelPath,
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1); // Ajustar escala conforme necessário
            model.position.set(0, 0, 0);
            model.rotation.x = -Math.PI / 2;

            // Adicionar o modelo ao anchor do MindAR
            const anchor = mindarThree.addAnchor(0);
            anchor.group.add(model);
            modelRef.current = model;

            setIsLoading(false);
          },
          undefined,
          (error) => {
            console.error('Erro ao carregar modelo:', error);
            setError('Falha ao carregar o modelo 3D');
            setIsLoading(false);
          }
        );

        // Iniciar experiência AR
        await mindarThree.start();
        mindarThreeRef.current = mindarThree;

        // Função de renderização
        renderer.setAnimationLoop(() => {
          if (modelRef.current) {
            modelRef.current.rotation.z += 0.005; // Rotação suave do modelo
          }
          renderer.render(scene, camera);
        });

      } catch (err) {
        console.error('Erro ao iniciar AR:', err);
        setError('Falha ao iniciar a experiência AR');
        setIsLoading(false);
      }
    };

    startAR();

    // Cleanup
    return () => {
      if (mindarThreeRef.current) {
        mindarThreeRef.current.stop();
      }
    };
  }, [modelPath]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {isLoading && (
        <div className="loading">
          A carregar experiência AR...
        </div>
      )}
      {error && (
        <div className="error">
          {error}
        </div>
      )}
      <style jsx>{`
        .loading, .error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .error {
          background: rgba(255, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ARViewer;
 
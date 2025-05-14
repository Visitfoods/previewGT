'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { defaultModel } from '../Models/models';
import Script from 'next/script';
import Head from 'next/head';

const ARPage: React.FC = () => {
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(0);
  const [arStarted, setArStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalScripts = 3;

  useEffect(() => {
    // Limpar qualquer instância AR ao desmontar o componente
    return () => {
      if (arStarted) {
        cleanupAR();
      }
    };
  }, [arStarted]);

  const cleanupAR = () => {
    const container = document.getElementById('ar-container');
    if (container) {
      container.innerHTML = '';
    }
    setArStarted(false);
    setError(null);
  };

  const handleScriptLoad = () => {
    setScriptsLoaded(prev => {
      const newCount = prev + 1;
      console.log(`Script carregado (${newCount}/${totalScripts})`);
      return newCount;
    });
  };

  const startAR = () => {
    if (scriptsLoaded < totalScripts || arStarted) return;

    const container = document.getElementById('ar-container');
    if (!container) return;

    try {
      // Limpar o container antes de iniciar
      container.innerHTML = '';
      
      // Criar uma cena AR simplificada
      const arScene = document.createElement('div');
      arScene.style.width = '100%';
      arScene.style.height = '100%';
      arScene.style.position = 'relative';
      arScene.innerHTML = `
        <a-scene 
          mindar-image="imageTargetSrc: /targets/target.mind;" 
          embedded
          color-space="sRGB" 
          renderer="colorManagement: true; physicallyCorrectLights: true"
          vr-mode-ui="enabled: false" 
          device-orientation-permission-ui="enabled: false"
          style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
        >
          <a-assets>
            <img id="card" src="/imagetrace/card.png" />
            <a-asset-item id="gelato-model" src="/models/3dgelato.ply"></a-asset-item>
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          
          <a-entity mindar-image-target="targetIndex: 0">
            <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>
            
            <!-- Usar um cubo colorido como fallback caso o modelo não carregue -->
            <a-box position="0 0.2 0.1" color="#4CC3D9" rotation="0 45 0" scale="0.2 0.2 0.2" animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"></a-box>
          </a-entity>
        </a-scene>
      `;
      
      container.appendChild(arScene);
      
      // Registrar manipuladores de eventos
      if (window.addEventListener) {
        window.addEventListener('camera-init', () => {
          console.log('Câmara AR inicializada');
        });
        
        window.addEventListener('target-found', () => {
          console.log('Target AR encontrado');
        });
        
        window.addEventListener('target-lost', () => {
          console.log('Target AR perdido');
        });
      }
      
      setArStarted(true);
    } catch (error) {
      console.error('Erro ao iniciar AR:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Erro ao iniciar AR: ${errorMessage}`);
      container.innerHTML = `<div class="error-message">Erro ao iniciar AR: ${errorMessage}</div>`;
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <Script 
          src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.1/dist/mindar-image.prod.js"
          onLoad={handleScriptLoad}
          strategy="beforeInteractive"
        />
        <Script 
          src="https://aframe.io/releases/1.3.0/aframe.min.js"
          onLoad={handleScriptLoad}
          strategy="beforeInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.1/dist/mindar-image-aframe.prod.js"
          onLoad={handleScriptLoad}
          strategy="beforeInteractive"
        />

        <header>
          <Link href="/">
            <span className="back-link">← Voltar</span>
          </Link>
          <h1>Gelatomania AR</h1>
        </header>

        <main>
          <div className="ar-container">
            <h2>Visualização em Realidade Aumentada</h2>
            
            {error && (
              <div className="error-banner">
                {error}
                <button 
                  className="close-error-button" 
                  onClick={() => setError(null)}
                >
                  ×
                </button>
              </div>
            )}
            
            <p className="instructions">
              Esta experiência AR usa tracking de imagem para mostrar um modelo 3D sobre a imagem de referência.
            </p>
            
            <div className="reference-images">
              <div className="reference-image-container">
                <h3>Imagem de Referência:</h3>
                <Image 
                  src="/imagetrace/card.png"
                  alt="Imagem para tracking AR"
                  width={200}
                  height={120}
                  className="reference-image"
                  onClick={() => setShowImageFullscreen(true)}
                />
                <div className="image-caption">Clique na imagem para ampliar</div>
                <p className="note">Aponte a câmara para esta imagem depois de iniciar a AR</p>
              </div>
            </div>

            <div className="button-container">
              <button 
                className="start-ar-button" 
                onClick={startAR}
                disabled={scriptsLoaded < totalScripts || arStarted}
              >
                {scriptsLoaded < totalScripts 
                  ? `A carregar scripts... (${scriptsLoaded}/${totalScripts})` 
                  : arStarted 
                    ? 'AR em execução' 
                    : 'Iniciar AR'}
              </button>
              
              {arStarted && (
                <button 
                  className="stop-ar-button" 
                  onClick={cleanupAR}
                >
                  Parar AR
                </button>
              )}
            </div>
            
            <div id="ar-container" className="ar-placeholder">
              {!arStarted && (
                <div className="ar-message">
                  <h3>Realidade Aumentada com Tracking de Imagem</h3>
                  <p>Clique no botão acima para iniciar a experiência AR.</p>
                  <p>Depois de iniciar, aponte a câmara para a imagem de referência.</p>
                </div>
              )}
            </div>
          </div>
          
          {showImageFullscreen && (
            <div className="fullscreen-overlay" onClick={() => setShowImageFullscreen(false)}>
              <div className="fullscreen-image-container">
                <Image 
                  src="/imagetrace/card.png"
                  alt="Imagem para tracking AR"
                  width={800}
                  height={480}
                  className="fullscreen-image"
                />
                <div className="close-button">×</div>
                <div className="fullscreen-caption">
                  <p>Imprima esta imagem ou visualize-a em outro dispositivo para usar como marcador AR.</p>
                  <p>Clique em qualquer lugar para fechar</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="info-box">
            <h3>Como usar:</h3>
            <ol>
              <li>Clique no botão "Iniciar AR" acima</li>
              <li>Permita o acesso à câmara quando solicitado</li>
              <li>Aponte a câmara para a imagem de referência</li>
              <li>Mantenha a câmara estável enquanto o modelo carrega</li>
              <li>O modelo 3D aparecerá sobre a imagem de referência</li>
            </ol>
            <p className="note">Nota: Esta funcionalidade requer uma câmara funcional e boa iluminação. Funciona melhor em dispositivos móveis modernos.</p>
            
            <div className="troubleshooting">
              <h3>Resolução de problemas:</h3>
              <ul>
                <li>Se a câmara não ligar, verifique as permissões do navegador</li>
                <li>Se o modelo não aparecer, tente reiniciar a AR</li>
                <li>Em dispositivos iOS, use o Safari para melhor compatibilidade</li>
                <li>Certifique-se de que há boa iluminação na imagem de referência</li>
              </ul>
            </div>
          </div>
        </main>

        <footer>
          <p>&copy; 2025 Gelatomania. Todos os direitos reservados.</p>
        </footer>

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding: 20px;
          }
          
          header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .back-link {
            margin-right: 20px;
            color: #4CAF50;
            text-decoration: none;
            font-weight: bold;
            cursor: pointer;
          }
          
          h1 {
            font-size: 24px;
            color: #4CAF50;
          }
          
          h2 {
            font-size: 20px;
            margin-bottom: 15px;
            color: #333;
          }
          
          h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #333;
          }
          
          .error-banner {
            background-color: #ffebee;
            color: #d32f2f;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            position: relative;
            padding-right: 40px;
          }
          
          .close-error-button {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: #d32f2f;
            font-size: 20px;
            cursor: pointer;
          }
          
          .instructions {
            margin-bottom: 20px;
            font-size: 16px;
            color: #555;
          }
          
          main {
            flex: 1;
          }
          
          .ar-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .reference-images {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .reference-image-container {
            text-align: center;
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            width: 100%;
            max-width: 300px;
          }
          
          .reference-image {
            cursor: pointer;
            border: 2px solid #4CAF50;
            border-radius: 4px;
            transition: transform 0.2s;
          }
          
          .reference-image:hover {
            transform: scale(1.05);
          }
          
          .image-caption {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
          }
          
          .button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .start-ar-button, .stop-ar-button {
            display: block;
            padding: 12px 24px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            margin-bottom: 10px;
            min-width: 200px;
          }
          
          .stop-ar-button {
            background-color: #f44336;
          }
          
          .start-ar-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
          
          .start-ar-button:hover:not(:disabled) {
            background-color: #45a049;
          }
          
          .stop-ar-button:hover {
            background-color: #d32f2f;
          }
          
          .ar-placeholder {
            width: 100%;
            height: 60vh;
            min-height: 400px;
            background-color: #f5f5f5;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
          }
          
          .ar-message {
            text-align: center;
            padding: 20px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            z-index: 1;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          
          .fullscreen-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .fullscreen-image-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
          }
          
          .fullscreen-image {
            display: block;
            max-width: 100%;
            max-height: 80vh;
            border: 2px solid white;
          }
          
          .close-button {
            position: absolute;
            top: -20px;
            right: -20px;
            width: 40px;
            height: 40px;
            background-color: #f44336;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
          }
          
          .fullscreen-caption {
            color: white;
            text-align: center;
            margin-top: 10px;
          }
          
          .info-box {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
          }
          
          .info-box h3 {
            margin-bottom: 10px;
            color: #333;
          }
          
          .info-box ol, .info-box ul {
            margin-left: 20px;
            margin-bottom: 15px;
          }
          
          .info-box li {
            margin-bottom: 8px;
          }
          
          .note {
            font-style: italic;
            color: #666;
            margin-top: 10px;
          }
          
          .troubleshooting {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
          }
          
          .error-message {
            color: #f44336;
            font-weight: bold;
            text-align: center;
            padding: 20px;
          }
          
          footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          
          @media (max-width: 768px) {
            .ar-placeholder {
              height: 50vh;
            }
            
            .reference-image-container {
              max-width: 100%;
            }
          }
          
          /* Estilos para A-Frame */
          :global(a-scene) {
            width: 100%;
            height: 100%;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
          }
        `}</style>
      </div>
    </>
  );
};

export default ARPage; 
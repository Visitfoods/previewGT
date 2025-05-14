'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
          loading-screen="enabled: false"
          style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"
        >
          <a-assets>
            <img id="card" src="/imagetrace/card.png" />
            <a-asset-item id="gelato-model" src="/models/3dgelato.ply"></a-asset-item>
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
          
          <a-entity mindar-image-target="targetIndex: 0">
            <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>
            
            <!-- Usar um cubo colorido como fallback -->
            <a-box position="0 0.2 0.1" color="#4CC3D9" rotation="0 45 0" scale="0.2 0.2 0.2" animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"></a-box>
          </a-entity>
        </a-scene>
      `;
      
      container.appendChild(arScene);
      
      // Usar um timeout para solicitar permissão da câmara explicitamente
      setTimeout(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
              console.log("Permissão de câmara concedida");
              // O stream será usado automaticamente pelo A-Frame
              stream.getTracks().forEach(track => track.stop()); // Parar o stream, pois A-Frame terá o seu próprio
            })
            .catch(function(err) {
              console.error("Erro ao obter acesso à câmara:", err);
              setError(`Erro de câmara: ${err.message}. Verifique as permissões.`);
            });
        }
      }, 500);
      
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
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
          <h1>Realidade Aumentada</h1>
        </header>

        <main>
          <div className="ar-container">
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
            
            <div className="reference-image-container">
              <h3>Imagem de Referência:</h3>
              <Image 
                src="/imagetrace/card.png"
                alt="Imagem para tracking AR"
                width={200}
                height={120}
                onClick={() => setShowImageFullscreen(true)}
                className="reference-image"
              />
              <p className="image-caption">Clique para ampliar • Use esta imagem para o AR</p>
            </div>

            <div className="button-container">
              <button 
                className="start-ar-button" 
                onClick={startAR}
                disabled={scriptsLoaded < totalScripts || arStarted}
              >
                {scriptsLoaded < totalScripts 
                  ? `A carregar (${scriptsLoaded}/${totalScripts})` 
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
            
            <div id="ar-container" className="ar-view">
              {!arStarted && (
                <div className="ar-message">
                  <p>Clique em "Iniciar AR" e aponte a câmara para a imagem acima.</p>
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
              </div>
            </div>
          )}
          
          <div className="info-box">
            <h3>Como usar:</h3>
            <ol>
              <li>Clique no botão "Iniciar AR"</li>
              <li>Permita o acesso à câmara</li>
              <li>Aponte a câmara para a imagem de referência</li>
              <li>Mantenha a câmara estável para melhor resultado</li>
            </ol>
            
            <div className="troubleshooting">
              <h3>Resolução de problemas:</h3>
              <ul>
                <li>Se a câmara não ligar, verifique as permissões</li>
                <li>Em dispositivos iOS, use o Safari</li>
                <li>Certifique-se de que há boa iluminação</li>
              </ul>
            </div>
          </div>
        </main>

        <footer>
          <p>&copy; 2025 Gelatomania AR</p>
        </footer>

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            padding: 15px;
            max-width: 800px;
            margin: 0 auto;
          }
          
          header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .back-link {
            margin-right: 15px;
            color: #4CAF50;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
          }
          
          h1 {
            font-size: 22px;
            color: #4CAF50;
            margin: 0;
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
            margin-bottom: 15px;
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
          
          main {
            flex: 1;
          }
          
          .ar-container {
            width: 100%;
          }
          
          .reference-image-container {
            text-align: center;
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
          }
          
          .reference-image {
            cursor: pointer;
            border: 2px solid #4CAF50;
            border-radius: 4px;
          }
          
          .image-caption {
            margin-top: 8px;
            font-size: 14px;
            color: #666;
          }
          
          .button-container {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
          }
          
          .start-ar-button, .stop-ar-button {
            padding: 12px;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            flex: 1;
          }
          
          .start-ar-button {
            background-color: #4CAF50;
            color: white;
          }
          
          .stop-ar-button {
            background-color: #f44336;
            color: white;
          }
          
          .start-ar-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }
          
          .ar-view {
            width: 100%;
            height: 50vh;
            min-height: 300px;
            background-color: #f5f5f5;
            border-radius: 8px;
            margin-bottom: 15px;
            position: relative;
            overflow: hidden;
          }
          
          .ar-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.9);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            max-width: 80%;
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
            top: -15px;
            right: -15px;
            width: 30px;
            height: 30px;
            background-color: #f44336;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
          }
          
          .info-box {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
          }
          
          .info-box ol, .info-box ul {
            margin-left: 20px;
            margin-bottom: 15px;
          }
          
          .info-box li {
            margin-bottom: 8px;
          }
          
          .troubleshooting {
            margin-top: 15px;
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
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #666;
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
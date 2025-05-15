import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const SPLAT_SRC = '/models/Gelado 3D_SUPERSPLAT.splat';

const GelatoSplatPage: React.FC = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar scripts A-Frame e aframe-gaussian-splatting
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src='${src}']`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://aframe.io/releases/1.4.2/aframe.min.js'),
      loadScript('https://quadjr.github.io/aframe-gaussian-splatting/index.js'),
    ]).then(() => setScriptsLoaded(true));
  }, []);

  useEffect(() => {
    if (scriptsLoaded && sceneRef.current) {
      sceneRef.current.innerHTML = `
        <a-scene embedded style="width: 100%; height: 60vh; background: #222;">
          <a-entity gaussian_splatting="src: ${SPLAT_SRC};" position="0 1.5 -2"></a-entity>
          <a-camera position="0 1.6 0"></a-camera>
        </a-scene>
      `;
    }
  }, [scriptsLoaded]);

  return (
    <>
      <Head>
        <title>Visualização Splat 3D | Gelatomania AR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="container">
        <header>
          <Link href="/">
            <span className="back-link">← Voltar</span>
          </Link>
          <h1>Visualização 3D Gaussian Splat</h1>
        </header>
        <main>
          <div ref={sceneRef} className="splat-viewer">
            {!scriptsLoaded && <p>A carregar visualizador...</p>}
          </div>
          <div className="info-box">
            <p>Este é o modelo 3D do gelado em formato Gaussian Splatting.</p>
            <p>Podes rodar, fazer zoom e explorar o modelo.</p>
          </div>
        </main>
        <footer>
          <p>&copy; 2025 Gelatomania AR</p>
        </footer>
        <style jsx>{`
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
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
          }
          h1 {
            font-size: 22px;
            color: #4CAF50;
            margin: 0;
          }
          .splat-viewer {
            width: 100%;
            min-height: 350px;
            background: #222;
            border-radius: 10px;
            margin-bottom: 20px;
            overflow: hidden;
          }
          .info-box {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 15px;
            color: #333;
          }
          footer {
            margin-top: 30px;
            text-align: center;
            color: #888;
            font-size: 14px;
          }
        `}</style>
      </div>
    </>
  );
};

export default GelatoSplatPage; 
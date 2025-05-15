'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Gelatomania AR</title>
        <meta name="description" content="Visualize gelados em realidade aumentada" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="container">
        <header>
          <h1 className="title">Gelatomania AR</h1>
          <p className="subtitle">Visualize gelados em realidade aumentada</p>
        </header>

        <main>
          <div className="card">
            <div className="image-container">
              <Image 
                src="/imagetrace/qrcode.jpg"
                alt="Imagem de referência para AR"
                width={200}
                height={200}
                className="reference-image"
              />
            </div>
            
            <div className="info">
              <p>Use esta imagem como referência para ver o gelado em realidade aumentada</p>
              <div className="buttons">
                <Link href="/scan" className="button scan-button">
                  Escanear QR Code
                </Link>
                <Link href="/ar" className="button ar-button">
                  Iniciar Experiência AR
                </Link>
              </div>
            </div>
          </div>
          
          <div className="instructions">
            <h2>Como utilizar:</h2>
            <ol>
              <li>Clique em "Escanear QR Code" ou "Iniciar Experiência AR"</li>
              <li>Permita o acesso à câmara quando solicitado</li>
              <li>Aponte a câmara para a imagem acima</li>
              <li>O modelo 3D do gelado aparecerá sobre a imagem</li>
            </ol>
          </div>
        </main>

        <footer>
          <p>&copy; 2025 Gelatomania AR</p>
        </footer>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 500px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .title {
          color: #4CAF50;
          font-size: 32px;
          margin: 0;
          margin-bottom: 5px;
        }
        
        .subtitle {
          color: #555;
          margin: 0;
          font-size: 16px;
        }
        
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .card {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          width: 100%;
          margin-bottom: 25px;
        }
        
        .image-container {
          padding: 20px;
          background-color: #f8f8f8;
          display: flex;
          justify-content: center;
        }
        
        .reference-image {
          border: 2px solid #4CAF50;
          border-radius: 8px;
        }
        
        .info {
          padding: 20px;
          text-align: center;
        }
        
        .info p {
          color: #555;
          margin-bottom: 20px;
          font-size: 16px;
        }
        
        .buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .button {
          display: block;
          padding: 14px;
          border-radius: 6px;
          font-weight: bold;
          text-align: center;
          text-decoration: none;
          transition: transform 0.2s, background-color 0.2s;
        }
        
        .button:active {
          transform: translateY(1px);
        }
        
        .scan-button {
          background-color: #2196F3;
          color: white;
        }
        
        .ar-button {
          background-color: #4CAF50;
          color: white;
        }
        
        .instructions {
          background-color: #f5f5f5;
          border-radius: 12px;
          padding: 20px;
          width: 100%;
        }
        
        .instructions h2 {
          color: #333;
          font-size: 18px;
          margin-top: 0;
          margin-bottom: 15px;
        }
        
        .instructions ol {
          margin: 0;
          padding-left: 20px;
        }
        
        .instructions li {
          margin-bottom: 10px;
          color: #555;
        }
        
        footer {
          margin-top: 30px;
          text-align: center;
          color: #888;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Home; 
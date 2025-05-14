'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import QRScanner from '../components/QRScanner';

const Home: React.FC = () => {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const handleScan = (result: string) => {
    if (!result) return;

    // Assumindo que o resultado do QR code é o ID do produto
    // Em uma aplicação real, poderia ser uma URL completa ou outro formato
    const productId = result;
    
    console.log('QR Code detetado:', productId);
    
    // Verificação adicional para debug
    const targetUrl = `/produto/${productId}`;
    console.log('Navegando para:', targetUrl);
    
    setScanning(false);
    
    // Pequeno atraso para garantir que o console.log apareça
    setTimeout(() => {
      // Navegar para a página do produto
      router.push(targetUrl);
    }, 100);
  };

  const toggleScanner = () => {
    setScanning(!scanning);
  };

  return (
    <>
      <Head>
        <title>Gelatomania AR</title>
        <meta name="description" content="Visualize modelos 3D de gelados em realidade aumentada" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <div className="container">
        <header>
          <h1 className="title">Gelatomania AR</h1>
        </header>

        <main>
          {!scanning ? (
            <div className="welcome-container">
              <h2>Visualize gelados em 3D</h2>
              <p>Aponte a câmara para um código QR de gelado para ver o modelo 3D</p>
              
              <div className="feature-section">
                <div className="feature-card">
                  <Image 
                    src="/imagetrace/card.png"
                    alt="Exemplo de código QR"
                    width={100}
                    height={100}
                    className="qr-example-image"
                  />
                  <h3>Leia o código QR</h3>
                  <p>Use a câmara do seu dispositivo para escanear o código QR</p>
                </div>
                
                <div className="feature-card">
                  <div className="model-placeholder">3D</div>
                  <h3>Visualize em 3D</h3>
                  <p>Veja modelos 3D realistas de gelados</p>
                </div>
                
                <div className="feature-card">
                  <div className="ar-placeholder">AR</div>
                  <h3>Experiência AR</h3>
                  <p>Experimente o gelado em realidade aumentada</p>
                </div>
              </div>
              
              <div className="buttons-container">
                <button onClick={toggleScanner} className="scan-button">
                  Escanear código QR
                </button>
                
                <Link href="/ar" className="ar-button">
                  Ir para AR
                </Link>
                
                <Link href="/produto/gelato-3d" className="model-button">
                  Ver modelo 3D diretamente
                </Link>
              </div>
              
              <div className="tracking-image-container">
                <h3>Imagem para AR tracking:</h3>
                <Image 
                  src="/imagetrace/card.png"
                  alt="Imagem para tracking AR"
                  width={200}
                  height={200}
                  className="tracking-image-preview"
                />
                <p>
                  Use esta imagem para a experiência de AR, ou visite a{' '}
                  <Link href="/ar" className="ar-page-link">
                    página de AR
                  </Link>
                  {' '}para mais detalhes.
                </p>
              </div>
            </div>
          ) : (
            <div className="scanner-container">
              <h2>Escanear código QR</h2>
              <QRScanner onScan={handleScan} />
              <button onClick={toggleScanner} className="cancel-button">
                Cancelar
              </button>
            </div>
          )}
        </main>

        <footer>
          <p>&copy; 2025 Gelatomania. Todos os direitos reservados.</p>
        </footer>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        header {
          margin-bottom: 30px;
          text-align: center;
        }
        
        .title {
          color: #4CAF50;
          font-size: 32px;
          margin: 0;
        }
        
        main {
          flex: 1;
        }
        
        .welcome-container {
          text-align: center;
        }
        
        h2 {
          font-size: 24px;
          margin-bottom: 15px;
          color: #333;
        }
        
        p {
          color: #666;
          margin-bottom: 20px;
        }
        
        .feature-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
          margin: 30px 0;
        }
        
        .feature-card {
          background-color: #f9f9f9;
          border-radius: 10px;
          padding: 20px;
          width: 220px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
        }
        
        .feature-card h3 {
          margin: 15px 0 10px;
          color: #333;
        }
        
        .feature-card p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        
        .qr-example-image {
          border-radius: 5px;
        }
        
        .model-placeholder, .ar-placeholder {
          height: 100px;
          background-color: #e0f2e0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          border-radius: 5px;
        }
        
        .buttons-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 30px;
        }
        
        .scan-button, .ar-button, .model-button {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          width: 250px;
          text-align: center;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        
        .scan-button:hover {
          background-color: #45a049;
        }
        
        .ar-button {
          background-color: #2196F3;
        }
        
        .ar-button:hover {
          background-color: #1e88e5;
        }
        
        .model-button {
          background-color: #9c27b0;
        }
        
        .model-button:hover {
          background-color: #8e24aa;
        }
        
        .tracking-image-container {
          margin-top: 40px;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 10px;
        }
        
        .tracking-image-preview {
          border: 2px solid #4CAF50;
          border-radius: 8px;
          margin: 15px 0;
        }
        
        .ar-page-link {
          color: #4CAF50;
          text-decoration: none;
          font-weight: bold;
        }
        
        .ar-page-link:hover {
          text-decoration: underline;
        }
        
        .scanner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .cancel-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }
        
        .cancel-button:hover {
          background-color: #e53935;
        }
        
        footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        
        @media (max-width: 768px) {
          .feature-section {
            flex-direction: column;
            align-items: center;
          }
          
          .feature-card {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </>
  );
};

export default Home; 
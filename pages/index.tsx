'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Importar o componente QRScanner dinamicamente para evitar erros de SSR
const QRScanner = dynamic(() => import('../components/QRScanner'), {
  ssr: false,
});

const Home: React.FC = () => {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleScan = (result: string) => {
    if (!result) return;

    // Assumindo que o resultado do QR code é o ID do produto
    // Em uma aplicação real, poderia ser uma URL completa ou outro formato
    const productId = result;
    
    console.log('QR Code detetado:', productId);
    setScanning(false);
    
    // Navegar para a página do produto
    router.push(`/produto/${productId}`);
  };

  const startScanning = () => {
    setScanning(true);
    setError(null);
  };

  return (
    <div className="container">
      <header>
        <h1>Gelatomania AR</h1>
        <p>Aponte a câmara para um código QR de gelado para ver o modelo 3D</p>
      </header>

      <main>
        {scanning ? (
          <div className="scanner-container">
            {showInstructions && (
              <div className="instructions-overlay">
                <div className="instructions-content">
                  <h2>Como utilizar o Scanner QR</h2>
                  <ol>
                    <li>Permita o acesso à câmara quando solicitado</li>
                    <li>Aponte a câmara para o código QR</li>
                    <li>Mantenha o código QR dentro da área de leitura (quadrado verde)</li>
                    <li>Aguarde a deteção do código</li>
                    <li>Se tiver problemas, pode tentar o modo alternativo</li>
                  </ol>
                  <div className="qr-example">
                    <p>Exemplo de código QR válido:</p>
                    <Image 
                      src="/imagetrace/qrcode.svg"
                      alt="Exemplo de código QR"
                      width={100}
                      height={100}
                      className="qr-example-image"
                    />
                  </div>
                  <button 
                    className="start-button"
                    onClick={() => setShowInstructions(false)}
                  >
                    Entendi, começar a ler
                  </button>
                </div>
              </div>
            )}
            
            {!showInstructions && (
              <>
                <QRScanner onScan={handleScan} />
                <div className="scanner-info">
                  <p>Posicione o código QR dentro da área destacada</p>
                  <p className="scanner-tip">Dica: Certifique-se de que há boa iluminação e que o código não está desfocado</p>
                </div>
                <button 
                  className="cancel-button"
                  onClick={() => setScanning(false)}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="start-container">
            <button 
              className="start-button"
              onClick={startScanning}
            >
              Iniciar Scanner de QR Code
            </button>
            
            <div className="options-container">
              <p>Escolha uma opção:</p>
              
              <Link href="/produto/gelado-tradicional">
                <span className="option-button">
                  Ver Gelado Tradicional
                </span>
              </Link>
              
              <Link href="/produto/gelato-3d">
                <span className="option-button">
                  Ver Gelato 3D
                </span>
              </Link>
            </div>
            
            <div className="ar-demo-container">
              <div className="ar-demo-text">
                <h3>Imagem de exemplo para QR Code:</h3>
                <p>Use esta imagem para testar o scanner</p>
              </div>
              <div className="ar-demo-image">
                <Image 
                  src="/imagetrace/qrcode.svg"
                  alt="Imagem para tracking AR"
                  width={200}
                  height={200}
                  className="tracking-image-preview"
                />
              </div>
            </div>
            
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
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
          text-align: center;
          margin-bottom: 30px;
        }
        
        h1 {
          font-size: 28px;
          color: #4CAF50;
          margin-bottom: 10px;
        }
        
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .scanner-container {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .instructions-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        
        .instructions-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .instructions-content h2 {
          color: #4CAF50;
          margin-bottom: 15px;
        }
        
        .instructions-content ol {
          padding-left: 20px;
          margin-bottom: 20px;
        }
        
        .instructions-content li {
          margin-bottom: 10px;
        }
        
        .qr-example {
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .qr-example-image {
          border: 2px solid #4CAF50;
          border-radius: 8px;
          margin-top: 10px;
        }
        
        .scanner-info {
          margin-top: 20px;
          text-align: center;
          background-color: #f5f5f5;
          padding: 10px;
          border-radius: 8px;
          width: 100%;
        }
        
        .scanner-tip {
          font-size: 14px;
          color: #666;
          margin-top: 5px;
        }
        
        .start-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        
        .start-button {
          padding: 15px 30px;
          font-size: 18px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 20px;
        }
        
        .options-container {
          margin: 20px 0;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
        }
        
        .option-button {
          display: block;
          padding: 12px 25px;
          font-size: 16px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin: 10px 0;
          text-align: center;
        }
        
        .ar-demo-container {
          margin-top: 20px;
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 8px;
          max-width: 300px;
          text-align: center;
        }
        
        .ar-demo-text {
          margin-bottom: 10px;
        }
        
        .ar-demo-text h3 {
          font-size: 16px;
          margin: 0;
          color: #333;
        }
        
        .ar-demo-image {
          border: 2px solid #4CAF50;
          border-radius: 4px;
          display: inline-block;
          overflow: hidden;
        }
        
        .tracking-image-preview {
          display: block;
        }
        
        .cancel-button {
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .error-message {
          color: #f44336;
          margin-top: 10px;
        }
        
        footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .instructions-content {
            padding: 15px;
            max-height: 70vh;
          }
          
          .start-button {
            padding: 12px 24px;
            font-size: 16px;
          }
          
          .option-button {
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home; 
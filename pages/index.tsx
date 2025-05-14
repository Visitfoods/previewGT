'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Importar o componente QRScanner dinamicamente para evitar erros de SSR
const QRScanner = dynamic(() => import('../components/QRScanner'), {
  ssr: false,
});

const Home: React.FC = () => {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <QRScanner onScan={handleScan} />
            <button 
              className="cancel-button"
              onClick={() => setScanning(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="start-container">
            <button 
              className="start-button"
              onClick={startScanning}
            >
              Iniciar Scanner de QR Code
            </button>
            
            <Link href="/ar">
              <span className="ar-button">
                Experimentar Realidade Aumentada
              </span>
            </Link>
            
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
        
        .ar-button {
          display: inline-block;
          padding: 12px 25px;
          font-size: 16px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 20px;
          text-align: center;
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
      `}</style>
    </div>
  );
};

export default Home; 
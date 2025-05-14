'use client';

import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

interface QRScannerProps {
  onScan: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    if (!videoRef.current || useFallback) return;

    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    const startScanner = async () => {
      try {
        // Verificar se a câmara está disponível
        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          setError('Não foi encontrada nenhuma câmara no dispositivo.');
          setHasPermission(false);
          return;
        }

        // Criar o scanner
        const qrScanner = new QrScanner(
          videoRef.current!,
          (result) => {
            // Callback quando um QR code é detetado
            onScan(result.data);
            // Parar o scanner após detetar um código
            qrScanner.stop();
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Usar câmara traseira
          }
        );

        // Iniciar o scanner
        await qrScanner.start();
        setHasPermission(true);
        scannerRef.current = qrScanner;
      } catch (err) {
        console.error('Erro ao iniciar o scanner:', err);
        setError('Não foi possível aceder à câmara. Verifique as permissões.');
        setHasPermission(false);
      }
    };

    startScanner();

    // Cleanup ao desmontar o componente
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [onScan, useFallback]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await QrScanner.scanImage(file);
        onScan(result.data);
      } catch (err) {
        console.error('Erro ao ler o QR code da imagem:', err);
        setError('Não foi possível ler o QR code da imagem. Tente outra imagem.');
      }
    }
  };

  return (
    <div className="qr-scanner-container">
      {!useFallback ? (
        <>
          {hasPermission === false && (
            <div className="error-message">
              {error || 'Não foi possível aceder à câmara.'}
              <div className="button-container">
                <button onClick={() => window.location.reload()}>Tentar novamente</button>
                <button onClick={() => setUseFallback(true)}>Usar modo alternativo</button>
              </div>
            </div>
          )}
          
          {hasPermission === null && (
            <div className="loading-message">A aceder à câmara...</div>
          )}
          
          <video 
            ref={videoRef} 
            className="qr-video" 
            muted 
            playsInline 
          />
        </>
      ) : (
        <div className="fallback-container">
          <p>Faça upload de uma imagem com QR code</p>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handleFileUpload} 
            className="file-input"
          />
          {error && <p className="error-text">{error}</p>}
          <button onClick={() => setUseFallback(false)} className="back-button">
            Voltar ao scanner
          </button>
        </div>
      )}
      
      <style jsx>{`
        .qr-scanner-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .qr-video {
          width: 100%;
          height: auto;
          aspect-ratio: 1;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .error-message, .loading-message {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 20px;
          border-radius: 8px;
        }
        
        .button-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }
        
        button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .fallback-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          min-height: 300px;
        }
        
        .file-input {
          margin: 20px 0;
        }
        
        .error-text {
          color: #f44336;
          margin: 10px 0;
        }
        
        .back-button {
          background-color: #2196F3;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default QRScanner; 
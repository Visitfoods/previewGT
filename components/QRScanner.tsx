'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// Importar QR Scanner dinamicamente para evitar problemas com SSR
let QrScanner: any = null;

const QRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Importar a biblioteca QR Scanner dinamicamente
    const loadQrScanner = async () => {
      try {
        const QrScannerModule = await import('qr-scanner');
        QrScanner = QrScannerModule.default;
        setIsLoading(false);
        initScanner();
      } catch (err) {
        console.error('Erro ao carregar biblioteca QR Scanner:', err);
        setError('Falha ao carregar o scanner de QR code');
        setIsLoading(false);
      }
    };

    loadQrScanner();

    return () => {
      // Cleanup
    };
  }, []);

  const initScanner = () => {
    if (!videoRef.current || !QrScanner) return;

    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result: any) => {
          console.log('QR Code detetado:', result);
          
          // Redirecionar para a página AR
          router.push('/ar');
          
          // Parar o scanner
          qrScanner.stop();
        },
        {
          preferredCamera: 'environment', // Usar a câmera traseira
          highlightScanRegion: true, // Destacar a região de escaneamento
          highlightCodeOutline: true, // Destacar o contorno do código
          returnDetailedScanResult: true
        }
      );

      qrScanner.start().catch((err: Error) => {
        console.error('Erro ao iniciar o scanner:', err);
        setError(`Não foi possível iniciar a câmera: ${err.message}`);
      });

      // Cleanup
      return () => {
        qrScanner.stop();
      };
    } catch (err) {
      console.error('Erro ao inicializar o scanner:', err);
      setError('Falha ao inicializar o scanner de QR code');
    }
  };

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      
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
          <p>A iniciar scanner de QR Code...</p>
        </div>
      )}
      
      {error && (
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
          zIndex: 1000,
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#ff6b6b', marginBottom: '20px' }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
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
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QRScanner; 
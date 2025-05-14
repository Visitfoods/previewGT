'use client';

import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { useRouter } from 'next/router';

interface QRScannerProps {
  onScan: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const scannerRef = useRef<QrScanner | null>(null);
  const router = useRouter();

  // Função para adicionar logs de debug
  const addDebugLog = (message: string) => {
    setDebugLog(prev => [message, ...prev.slice(0, 4)]);
    console.log(`QRScanner Debug: ${message}`);
  };

  // Quando o scanner não é utilizado por 30 segundos, tenta reiniciar
  useEffect(() => {
    if (!scanning || !scannerRef.current || useFallback) return;

    const interval = setInterval(() => {
      if (scannerRef.current) {
        addDebugLog("Reiniciando scanner por timeout");
        scannerRef.current.stop();
        setTimeout(() => {
          if (scannerRef.current) {
            scannerRef.current.start().catch(err => {
              addDebugLog(`Erro ao reiniciar: ${err.message}`);
            });
          }
        }, 300);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [scanning, useFallback]);

  useEffect(() => {
    if (!videoRef.current || useFallback) return;

    // Verificar se estamos no navegador
    if (typeof window === 'undefined') return;

    const startScanner = async () => {
      try {
        setScanning(true);
        addDebugLog("Iniciando configuração do scanner...");
        
        // Solicitar permissões explicitamente antes de iniciar
        try {
          addDebugLog("Solicitando permissões de câmara explicitamente...");
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          
          // Atribuir o stream ao elemento de vídeo diretamente
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch(e => {
                addDebugLog(`Erro ao reproduzir vídeo: ${e.message}`);
              });
            };
            
            addDebugLog("Stream de câmara obtido com sucesso!");
          }
        } catch (permissionError) {
          addDebugLog(`Erro ao solicitar permissões: ${permissionError instanceof Error ? permissionError.message : String(permissionError)}`);
        }
        
        // Debug da versão da biblioteca
        addDebugLog(`Versão do QR Scanner: ${'Verificando compatibilidade...'}`);
        
        // Verificar se a câmara está disponível
        const hasCamera = await QrScanner.hasCamera();
        if (!hasCamera) {
          setError('Não foi encontrada nenhuma câmara no dispositivo.');
          setHasPermission(false);
          addDebugLog("Nenhuma câmara encontrada");
          return;
        }

        // Listar câmaras disponíveis
        try {
          // @ts-ignore - listCameras existe mas não está na tipagem
          const cameras = await QrScanner.listCameras();
          addDebugLog(`Câmaras disponíveis: ${cameras.length}`);
          // @ts-ignore - a tipagem dos objetos de câmera não está definida
          cameras.forEach((cam: any, i: number) => {
            addDebugLog(`${i+1}: ${cam.label} (${cam.id})`);
          });
        } catch (err) {
          addDebugLog(`Erro ao listar câmaras: ${(err as Error).message}`);
        }

        // Criar o scanner com opções melhoradas
        const qrScanner = new QrScanner(
          videoRef.current!,
          (result) => {
            // Callback quando um QR code é detetado
            addDebugLog(`QR Code detetado: ${result.data}`);
            onScan(result.data);
            
            // Mostrar sucesso visual
            setScanning(false);
            
            // Parar o scanner após detetar um código
            qrScanner.stop();
          },
          {
            returnDetailedScanResult: true,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Usar câmara traseira
            // @ts-ignore - maxScansPerSecond existe mas não está na tipagem
            maxScansPerSecond: 5, // Reduzir para melhorar a precisão
            // @ts-ignore - calculateScanRegion existe mas não está na tipagem
            calculateScanRegion: (video: any) => {
              // Definir uma região de digitalização menor para melhor precisão
              const smallerDimension = Math.min(video.videoWidth, video.videoHeight);
              const scanRegionSize = Math.round(smallerDimension * 0.7); // 70% do tamanho
              
              return {
                x: Math.round((video.videoWidth - scanRegionSize) / 2),
                y: Math.round((video.videoHeight - scanRegionSize) / 2),
                width: scanRegionSize,
                height: scanRegionSize,
              };
            }
          }
        );

        // Iniciar o scanner
        await qrScanner.start();
        addDebugLog("Scanner iniciado com sucesso");
        setHasPermission(true);
        scannerRef.current = qrScanner;
      } catch (err) {
        console.error('Erro ao iniciar o scanner:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        addDebugLog(`Erro ao iniciar: ${errorMessage}`);
        setError(`Não foi possível aceder à câmara. ${errorMessage}`);
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
        addDebugLog("Scanner destruído");
      }
      
      // Parar todos os streams de vídeo
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        addDebugLog("Streams de mídia parados");
      }
    };
  }, [onScan, useFallback]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        addDebugLog(`Processando imagem: ${file.name}`);
        const result = await QrScanner.scanImage(file);
        addDebugLog(`QR Code detetado na imagem: ${result.data}`);
        onScan(result.data);
      } catch (err) {
        console.error('Erro ao ler o QR code da imagem:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        addDebugLog(`Erro na imagem: ${errorMessage}`);
        setError(`Não foi possível ler o QR code da imagem. ${errorMessage}`);
      }
    }
  };

  // Força a tentar novamente
  const handleRetry = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setHasPermission(null);
    setError(null);
    setScanning(false);
    addDebugLog("Tentando novamente...");
    
    setTimeout(() => {
      if (videoRef.current && !useFallback) {
        // Reinicia o scanner após um breve atraso
        const startScanner = async () => {
          try {
            const qrScanner = new QrScanner(
              videoRef.current!,
              (result) => {
                addDebugLog(`QR Code detetado: ${result.data}`);
                onScan(result.data);
                qrScanner.stop();
              },
              {
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true,
                preferredCamera: 'environment',
                // @ts-ignore - maxScansPerSecond existe mas não está na tipagem
                maxScansPerSecond: 5,
              }
            );

            await qrScanner.start();
            setScanning(true);
            setHasPermission(true);
            scannerRef.current = qrScanner;
            addDebugLog("Scanner reiniciado");
          } catch (err) {
            console.error('Erro ao reiniciar o scanner:', err);
            addDebugLog(`Falha ao reiniciar: ${err instanceof Error ? err.message : String(err)}`);
            setError('Não foi possível reiniciar o scanner.');
            setHasPermission(false);
          }
        };

        startScanner();
      }
    }, 500);
  };

  return (
    <div className="qr-scanner-container">
      {!useFallback ? (
        <>
          {hasPermission === false && (
            <div className="error-message">
              {error || 'Não foi possível aceder à câmara.'}
              <div className="button-container">
                <button onClick={handleRetry}>Tentar novamente</button>
                <button onClick={() => setUseFallback(true)}>Usar modo alternativo</button>
                <button 
                  onClick={() => {
                    addDebugLog("Teste: Simulando QR Code 'gelato-3d'");
                    onScan("gelato-3d");
                  }}
                  style={{ backgroundColor: '#2196F3' }}
                >
                  Testar com 'gelato-3d'
                </button>
                <button 
                  onClick={() => {
                    addDebugLog("Navegando diretamente para a experiência AR");
                    router.push("/ar");
                  }}
                  style={{ backgroundColor: '#9C27B0' }}
                >
                  Ir para AR diretamente
                </button>
              </div>
            </div>
          )}
          
          {hasPermission === null && (
            <div className="loading-message">
              A aceder à câmara...
              <div className="button-container" style={{ marginTop: '20px' }}>
                <button 
                  onClick={() => {
                    addDebugLog("Teste: Simulando QR Code 'gelato-3d'");
                    onScan("gelato-3d");
                  }}
                  style={{ backgroundColor: '#2196F3' }}
                >
                  Testar com 'gelato-3d'
                </button>
              </div>
            </div>
          )}
          
          {hasPermission === true && (
            <>
              <div className="scan-overlay">
                <div className="scan-region">
                  <div className={`scan-marker ${scanning ? 'scanning' : ''}`}></div>
                </div>
                <div className="scan-status">
                  {scanning ? 'A procurar código QR...' : 'Câmara pronta'}
                </div>
                <div style={{ position: 'absolute', bottom: '60px', width: '100%', textAlign: 'center' }}>
                  <button 
                    onClick={() => {
                      addDebugLog("Teste: Simulando QR Code 'gelato-3d'");
                      onScan("gelato-3d");
                    }}
                    style={{ 
                      backgroundColor: '#2196F3',
                      padding: '10px 15px',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    Testar com 'gelato-3d'
                  </button>
                </div>
              </div>
              <video 
                ref={videoRef} 
                className="qr-video" 
                muted 
                playsInline 
                autoPlay
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'cover',
                  border: '2px solid #4CAF50',
                  borderRadius: '8px',
                  background: '#000'
                }}
              />
            </>
          )}
          
          {/* Área de debug */}
          <div className="debug-panel">
            <div className="debug-header" onClick={() => setDebugLog([])}>
              Scanner Status (clique para limpar)
            </div>
            <div className="debug-logs">
              {debugLog.map((log, i) => (
                <div key={i} className="debug-log-entry">{log}</div>
              ))}
            </div>
          </div>
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
          
          {/* Mostrar logs de debug também no modo de fallback */}
          <div className="debug-logs fallback-logs">
            {debugLog.map((log, i) => (
              <div key={i} className="debug-log-entry">{log}</div>
            ))}
          </div>
          
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
          z-index: 10;
        }
        
        .scan-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          z-index: 5;
        }
        
        .scan-region {
          width: 70%;
          height: 70%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .scan-marker {
          width: 80%;
          height: 80%;
          border: 2px solid rgba(76, 175, 80, 0.7);
          border-radius: 8px;
        }
        
        .scan-marker.scanning {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(76, 175, 80, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
          }
        }
        
        .scan-status {
          position: absolute;
          bottom: 20px;
          width: 80%;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 8px;
          border-radius: 20px;
          font-size: 14px;
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
        
        .debug-panel {
          position: absolute;
          bottom: -120px;
          left: 0;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          color: #4CAF50;
          border-radius: 0 0 8px 8px;
          font-size: 12px;
          z-index: 15;
          max-height: 120px;
          overflow-y: auto;
        }
        
        .debug-header {
          padding: 5px 10px;
          background-color: #333;
          font-weight: bold;
          cursor: pointer;
        }
        
        .debug-logs {
          padding: 5px 10px;
          max-height: 100px;
          overflow-y: auto;
        }
        
        .debug-log-entry {
          margin: 2px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .fallback-logs {
          margin: 10px 0;
          text-align: left;
          background-color: #333;
          color: #4CAF50;
          border-radius: 4px;
          width: 100%;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
};

export default QRScanner; 
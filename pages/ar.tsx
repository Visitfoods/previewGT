'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { defaultModel } from '../Models/models';

// Importar o componente ARViewer dinamicamente
const ARViewer = dynamic(() => import('../components/ARViewer'), {
  ssr: false,
});

const ARPage: React.FC = () => {
  // Caminho para a imagem alvo (marcador)
  const [targetImage] = useState('/targets/target.mind');
  const [modelPath] = useState(defaultModel.path);

  return (
    <div className="container">
      <header>
        <Link href="/">
          <span className="back-link">← Voltar</span>
        </Link>
        <h1>Gelatomania AR</h1>
      </header>

      <main>
        <div className="ar-container">
          <h2>Visualização em Realidade Aumentada</h2>
          <p className="instructions">
            Aponte a câmara para a imagem de referência ou código QR para visualizar o modelo 3D em realidade aumentada.
          </p>
          
          <ARViewer 
            modelPath={modelPath} 
            targetImagePath={targetImage}
          />
          
          <div className="info-box">
            <h3>Como usar:</h3>
            <ol>
              <li>Permita o acesso à câmara quando solicitado</li>
              <li>Posicione a imagem alvo ou código QR na caixa de digitalização</li>
              <li>Mantenha a câmara estável enquanto o modelo carrega</li>
              <li>Visualize o modelo 3D na imagem alvo</li>
            </ol>
            <p className="note">Nota: Esta funcionalidade requer uma câmara funcional e boa iluminação.</p>
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
        
        .info-box {
          margin-top: 30px;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 18px;
          color: #333;
        }
        
        ol {
          margin-left: 20px;
          padding-left: 0;
        }
        
        li {
          margin-bottom: 8px;
        }
        
        .note {
          margin-top: 15px;
          font-style: italic;
          color: #666;
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

export default ARPage; 
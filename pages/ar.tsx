'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { defaultModel } from '../Models/models';

const ARPage: React.FC = () => {
  // Caminho para a imagem alvo (marcador)
  const [targetImage] = useState('/targets/target.mind');
  const [modelPath] = useState(defaultModel.path);
  const [showImageFullscreen, setShowImageFullscreen] = useState(false);

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
            Aponte a câmara para a imagem de referência para visualizar o modelo 3D em realidade aumentada.
          </p>
          
          <div className="ar-placeholder">
            <div className="ar-message">
              <h3>Realidade Aumentada com Tracking de Imagem</h3>
              <p>A aplicação está configurada para o seguinte:</p>
              <ul>
                <li><strong>Imagem de tracking:</strong> qrcode.jpg</li>
                <li><strong>Modelo 3D:</strong> {defaultModel.name} ({defaultModel.path.split('/').pop()})</li>
              </ul>
              <p className="note">
                Para testar, imprima ou visualize a imagem abaixo em outro dispositivo e aponte a câmara para ela.
              </p>
              
              <div className="tracking-image-container">
                <Image 
                  src="/imagetrace/qrcode.jpg"
                  alt="Imagem para tracking AR"
                  width={200}
                  height={150}
                  className="tracking-image"
                  onClick={() => setShowImageFullscreen(true)}
                />
                <div className="image-caption">Clique na imagem para ampliar</div>
              </div>
            </div>
          </div>
          
          {showImageFullscreen && (
            <div className="fullscreen-overlay" onClick={() => setShowImageFullscreen(false)}>
              <div className="fullscreen-image-container">
                <Image 
                  src="/imagetrace/qrcode.jpg"
                  alt="Imagem para tracking AR"
                  width={800}
                  height={600}
                  className="fullscreen-image"
                />
                <div className="close-button">×</div>
                <div className="fullscreen-caption">
                  <p>Imprima esta imagem ou visualize-a em outro dispositivo para usar como marcador AR.</p>
                  <p>Clique em qualquer lugar para fechar</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="info-box">
            <h3>Como usar:</h3>
            <ol>
              <li>Permita o acesso à câmara quando solicitado</li>
              <li>Posicione a imagem de tracking na caixa de digitalização</li>
              <li>Mantenha a câmara estável enquanto o modelo carrega</li>
              <li>Visualize o modelo 3D sobre a imagem</li>
            </ol>
            <p className="note">Nota: Esta funcionalidade requer uma câmara funcional e boa iluminação.</p>
            
            <div className="steps-container">
              <h4>Passos para gerar o arquivo de tracking:</h4>
              <ol>
                <li>Acesse <a href="https://hiukim.github.io/mind-ar-js-doc/tools/compile/" target="_blank" rel="noopener noreferrer">MindAR Image Compiler</a></li>
                <li>Faça upload da imagem qrcode.jpg</li>
                <li>Clique em "Compile" para gerar o arquivo .mind</li>
                <li>Baixe o arquivo e coloque-o em public/targets/target.mind</li>
              </ol>
            </div>
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
        
        .ar-placeholder {
          width: 100%;
          height: auto;
          min-height: 300px;
          background-color: #f5f5f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          padding: 30px 0;
        }
        
        .ar-message {
          text-align: center;
          padding: 20px;
          max-width: 80%;
        }
        
        .ar-message h3 {
          margin-bottom: 15px;
        }
        
        .ar-message ul {
          text-align: left;
          margin-left: 20px;
          margin-bottom: 15px;
          list-style-type: none;
        }
        
        .ar-message ul li {
          padding: 5px 0;
        }
        
        .tracking-image-container {
          margin: 25px auto;
          text-align: center;
        }
        
        .tracking-image {
          cursor: pointer;
          border: 2px solid #4CAF50;
          border-radius: 4px;
          transition: transform 0.2s;
        }
        
        .tracking-image:hover {
          transform: scale(1.05);
        }
        
        .image-caption {
          margin-top: 8px;
          font-size: 0.9rem;
          color: #666;
        }
        
        .fullscreen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: pointer;
        }
        
        .fullscreen-image-container {
          position: relative;
          max-width: 90%;
          max-height: 90%;
        }
        
        .fullscreen-image {
          max-width: 100%;
          max-height: 80vh;
          border: 3px solid white;
          border-radius: 4px;
        }
        
        .close-button {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 40px;
          height: 40px;
          background-color: #4CAF50;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          cursor: pointer;
        }
        
        .fullscreen-caption {
          color: white;
          text-align: center;
          margin-top: 15px;
        }
        
        .fullscreen-caption p {
          margin: 5px 0;
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
        
        h4 {
          margin: 20px 0 10px 0;
          font-size: 16px;
          color: #444;
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
        
        .steps-container {
          margin-top: 25px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }
        
        a {
          color: #2196F3;
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
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
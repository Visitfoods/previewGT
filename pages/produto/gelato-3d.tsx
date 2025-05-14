'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { defaultModel } from '../../Models/models';

// Importar o componente de visualização dinamicamente para evitar erros de SSR
const ModelViewer = dynamic(() => import('../../components/ModelViewer'), {
  ssr: false,
});

const Gelato3DPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Visualização 3D | Gelatomania AR</title>
        <meta name="description" content="Visualize o modelo 3D de gelado em detalhe" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <header>
          <Link href="/">
            <span className="back-link">
              ← Voltar
            </span>
          </Link>
          <h1>Visualização 3D</h1>
        </header>

        <main>
          <div className="model-container">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>A carregar modelo 3D...</p>
              </div>
            ) : (
              <ModelViewer modelPath={defaultModel.path} />
            )}
            
            <div className="model-info">
              <h2>{defaultModel.name}</h2>
              <p>{defaultModel.description}</p>
            </div>
            
            <div className="controls-info">
              <h3>Controlos:</h3>
              <ul>
                <li>Arrastar: Rodar modelo</li>
                <li>Scroll/Pinch: Zoom</li>
                <li>Botão direito + Arrastar: Mover modelo</li>
              </ul>
            </div>
          </div>
          
          <div className="action-buttons">
            <Link href="/ar" className="ar-button">
              Ver em Realidade Aumentada
            </Link>
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
          max-width: 1000px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
          margin: 0;
        }
        
        main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .model-container {
          position: relative;
          height: 60vh;
          min-height: 400px;
          background-color: #f5f5f5;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .loading {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(245, 245, 245, 0.8);
          z-index: 10;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(76, 175, 80, 0.3);
          border-radius: 50%;
          border-top: 4px solid #4CAF50;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .model-info {
          background-color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .model-info h2 {
          margin-top: 0;
          color: #333;
          font-size: 20px;
        }
        
        .model-info p {
          color: #555;
          line-height: 1.5;
        }
        
        .controls-info {
          background-color: #f0f9f0;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #4CAF50;
        }
        
        .controls-info h3 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #333;
          font-size: 16px;
        }
        
        .controls-info ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .controls-info li {
          margin-bottom: 5px;
          color: #555;
        }
        
        .action-buttons {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .ar-button {
          display: inline-block;
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
          text-decoration: none;
          padding: 14px 24px;
          border-radius: 6px;
          transition: background-color 0.2s, transform 0.2s;
        }
        
        .ar-button:hover {
          background-color: #3d9c40;
          transform: translateY(-2px);
        }
        
        footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 14px;
        }
      `}</style>
    </>
  );
};

export default Gelato3DPage; 
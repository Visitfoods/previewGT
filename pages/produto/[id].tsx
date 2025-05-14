'use client';

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ProductInfo from '../../components/ProductInfo';

// Importar o componente ModelViewer dinamicamente para evitar erros de SSR
const ModelViewer = dynamic(() => import('../../components/ModelViewer'), {
  ssr: false,
});

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Caminho para o modelo 3D
  // Em uma aplicação real, este caminho seria dinâmico com base no ID do produto
  const modelPath = '/models/Gelado 3D_SUPERSPLAT.compressed.ply';

  return (
    <div className="container">
      <header>
        <Link href="/">
          <a className="back-link">← Voltar</a>
        </Link>
        <h1>Gelatomania AR</h1>
      </header>

      <main>
        <div className="product-container">
          <div className="model-container">
            <h2>Visualização 3D</h2>
            <ModelViewer modelPath={modelPath} />
          </div>
          
          <div className="info-container">
            {id && typeof id === 'string' && <ProductInfo productId={id} />}
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
        
        main {
          flex: 1;
        }
        
        .product-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .model-container, .info-container {
          width: 100%;
        }
        
        footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
        
        /* Media query para desktop */
        @media (min-width: 768px) {
          .product-container {
            flex-direction: row;
            align-items: flex-start;
          }
          
          .model-container {
            flex: 1;
          }
          
          .info-container {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductPage; 
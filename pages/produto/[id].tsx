'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ProductInfo from '../../components/ProductInfo';
import { defaultModel, Model3D, getModelById } from '../../Models/models';
import Analytics, { trackEvent, useAnalytics } from '../../components/Analytics';

// Importar os componentes dinamicamente para evitar erros de SSR
const ModelViewer = dynamic(() => import('../../components/ModelViewer'), {
  ssr: false,
});

const ModelSelector = dynamic(() => import('../../components/ModelSelector'), {
  ssr: false,
});

const ProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  // Estado para controlar o modelo selecionado
  const [selectedModel, setSelectedModel] = useState<Model3D>(defaultModel);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Inicializar sistema de análise
  useAnalytics(isLowPerformance);

  useEffect(() => {
    // Detetar se o dispositivo tem baixo desempenho
    const detectLowPerformance = () => {
      // Verificar se é um dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Verificar a quantidade de RAM disponível (quando suportado)
      const lowMemory = 'deviceMemory' in navigator && (navigator as any).deviceMemory < 4;
      
      // Verificar a quantidade de núcleos de CPU (quando suportado)
      const lowCPU = 'hardwareConcurrency' in navigator && navigator.hardwareConcurrency < 4;
      
      return isMobile || lowMemory || lowCPU;
    };
    
    setIsLowPerformance(detectLowPerformance());
    
    // Rastreamento de carregamento da página
    if (id) {
      trackEvent('pageView', 'productPage', { 
        productId: id,
        userAgent: navigator.userAgent
      });
    }
  }, [id]);

  // Função para lidar com a seleção de um novo modelo
  const handleModelSelect = (model: Model3D) => {
    setSelectedModel(model);
    
    // Rastrear a mudança de modelo
    trackEvent('interaction', 'modelChanged', { 
      fromModelId: selectedModel.id,
      toModelId: model.id,
      productId: id
    });
  };

  return (
    <Analytics lowPerformanceMode={isLowPerformance}>
      <div className="container">
        <header>
          <Link href="/">
            <span className="back-link" onClick={() => trackEvent('interaction', 'backButtonClick')}>
              ← Voltar
            </span>
          </Link>
          <h1>Gelatomania AR</h1>
        </header>

        <main>
          <div className="product-container">
            <div className="model-container">
              <h2>Visualização 3D</h2>
              <ModelViewer modelPath={selectedModel.path} />
              
              {/* Componente de seleção de modelos */}
              <ModelSelector 
                onSelect={handleModelSelect} 
                selectedModelId={selectedModel.id}
              />
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
    </Analytics>
  );
};

export default ProductPage; 
'use client';

import React from 'react';

interface ProductInfoProps {
  productId: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ productId }) => {
  // Simulação de dados do produto
  // Em uma aplicação real, estes dados viriam de uma API ou banco de dados
  const getProductData = (id: string): ProductData => {
    // Dados fictícios para demonstração
    const products: Record<string, ProductData> = {
      'gelado1': {
        id: 'gelado1',
        name: 'Gelado de Baunilha Premium',
        description: 'Um delicioso gelado artesanal de baunilha com grãos de Madagascar.',
        price: '3,50€',
        features: [
          'Ingredientes naturais',
          'Sem conservantes',
          'Produção artesanal',
          'Baixo teor de açúcar'
        ]
      },
      'gelado2': {
        id: 'gelado2',
        name: 'Gelado de Chocolate Belga',
        description: 'Gelado cremoso de chocolate belga com pedaços de chocolate amargo.',
        price: '4,00€',
        features: [
          'Chocolate belga premium',
          'Textura extra cremosa',
          'Ideal para amantes de chocolate',
          'Decorado com raspas de chocolate'
        ]
      },
      // Produto padrão para qualquer ID não reconhecido
      'default': {
        id: id,
        name: 'Gelado Artesanal',
        description: 'Experimente o nosso gelado artesanal de alta qualidade.',
        price: '3,00€',
        features: [
          'Produção diária',
          'Ingredientes selecionados',
          'Sabor único'
        ]
      }
    };

    return products[id] || products['default'];
  };

  const product = getProductData(productId);

  return (
    <div className="product-info">
      <h1>{product.name}</h1>
      <div className="price">{product.price}</div>
      <p className="description">{product.description}</p>
      
      <h2>Características</h2>
      <ul className="features">
        {product.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      
      <style jsx>{`
        .product-info {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
          color: #333;
        }
        
        h2 {
          font-size: 18px;
          margin: 20px 0 10px;
          color: #555;
        }
        
        .price {
          font-size: 22px;
          font-weight: bold;
          color: #4CAF50;
          margin-bottom: 15px;
        }
        
        .description {
          line-height: 1.6;
          color: #666;
          margin-bottom: 20px;
        }
        
        .features {
          list-style-type: disc;
          padding-left: 20px;
        }
        
        .features li {
          margin-bottom: 8px;
          color: #555;
        }
      `}</style>
    </div>
  );
};

export default ProductInfo; 
import React from 'react';
import { Model3D, availableModels } from '../Models/models';

interface ModelSelectorProps {
  onSelect: (model: Model3D) => void;
  selectedModelId?: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelect, selectedModelId }) => {
  return (
    <div className="model-selector">
      <h3>Escolher Modelo 3D</h3>
      <div className="models-grid">
        {availableModels.map((model) => (
          <div 
            key={model.id}
            className={`model-card ${selectedModelId === model.id ? 'selected' : ''}`}
            onClick={() => onSelect(model)}
          >
            <div className="model-thumbnail">
              {model.thumbnail ? (
                <img src={model.thumbnail} alt={model.name} />
              ) : (
                <div className="placeholder-thumbnail">
                  <span>{model.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="model-info">
              <h4>{model.name}</h4>
              <p>{model.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .model-selector {
          margin: 20px 0;
        }
        
        h3 {
          margin-bottom: 10px;
          font-size: 1.2rem;
        }
        
        .models-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .model-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .model-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .model-card.selected {
          border: 2px solid #4CAF50;
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
        }
        
        .model-thumbnail {
          height: 150px;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .model-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .placeholder-thumbnail {
          width: 80px;
          height: 80px;
          background-color: #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .placeholder-thumbnail span {
          font-size: 2rem;
          color: #757575;
        }
        
        .model-info {
          padding: 10px;
        }
        
        .model-info h4 {
          margin: 0 0 5px 0;
          font-size: 1rem;
        }
        
        .model-info p {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default ModelSelector; 
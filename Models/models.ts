export interface Model3D {
  id: string;
  name: string;
  path: string;
  description: string;
  thumbnail?: string;
}

// Lista de modelos 3D disponíveis na aplicação
export const availableModels: Model3D[] = [
  {
    id: 'gelado-tradicional',
    name: 'Gelado Tradicional',
    path: '/models/Gelado 3D_SUPERSPLAT.compressed.ply',
    description: 'Modelo 3D de um gelado tradicional de cone',
    thumbnail: '/models/thumbnails/gelado-tradicional.jpg'
  },
  {
    id: 'gelato-3d',
    name: 'Gelato 3D',
    path: '/models/3dgelato.ply',
    description: 'Modelo 3D Gaussian Splat de gelato com detalhes realistas',
    thumbnail: '/imagetrace/qrcode.svg'
  }
  // Mais modelos podem ser adicionados aqui à medida que ficarem disponíveis
];

// Função para obter um modelo pelo ID
export const getModelById = (id: string): Model3D | undefined => {
  return availableModels.find(model => model.id === id);
};

// Modelo padrão para usar quando nenhum é especificado
export const defaultModel = availableModels[1]; // Usar o gelato-3d como padrão 
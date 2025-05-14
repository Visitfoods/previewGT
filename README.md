# Gelatomania-ARgelado com Istio

Este projeto demonstra a configuração do Istio como malha de serviço para a aplicação Gelatomania-ARgelado.

## Pré-requisitos

- Kubernetes cluster (Minikube, Kind, ou cluster gerido)
- kubectl configurado
- Istio CLI instalado

## Instalação do Istio

### 1. Descarregar e instalar Istio CLI

```bash
curl -L https://istio.io/downloadIstio | sh -
cd istio-*
export PATH=$PWD/bin:$PATH
```

### 2. Instalar Istio no cluster

```bash
istioctl install --set profile=demo -y
```

### 3. Ativar injeção automática de sidecar para o namespace

```bash
kubectl label namespace default istio-injection=enabled
```

## Estrutura do Projeto

```
.
├── kubernetes/
│   ├── istio/         # Configurações do Istio (gateways, virtual services, etc.)
│   └── apps/          # Manifestos das aplicações
├── .cursor/
│   └── rules/         # Regras para o Cursor AI
└── task.md            # Lista de tarefas do projeto
```

## Componentes do Istio

- **Gateway**: Gerencia o tráfego de entrada para a malha de serviço
- **VirtualService**: Define regras de roteamento para o tráfego
- **DestinationRule**: Configura políticas de tráfego após o roteamento
- **ServiceEntry**: Adiciona serviços externos à malha
- **Sidecar**: Proxy Envoy que intercepta todo o tráfego

## Monitorização

O Istio inclui várias ferramentas para monitorização:

- **Prometheus**: Recolha de métricas
- **Grafana**: Visualização de métricas
- **Jaeger/Zipkin**: Rastreamento distribuído
- **Kiali**: Visualização da malha de serviço 

# Gelatomania AR - Visualização 3D com QR Code e Realidade Aumentada

Este projeto é um MVP (Minimum Viable Product) de uma aplicação web para leitura de códigos QR e visualização de modelos 3D de gelados utilizando a técnica Gaussian Splat, com suporte para realidade aumentada.

## Funcionalidades

- Leitura de códigos QR através da câmara do dispositivo
- Visualização de modelos 3D em formato Gaussian Splat (.ply)
- Exibição de informações detalhadas do produto
- Realidade Aumentada com rastreamento de imagem/marcador
- Suporte para múltiplos modelos 3D
- Interface responsiva para dispositivos móveis e desktop

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor e cliente
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **Three.js**: Biblioteca para renderização 3D no navegador
- **Gaussian Splats 3D**: Biblioteca para visualização de modelos Gaussian Splat
- **QR Scanner**: Biblioteca para leitura de códigos QR
- **MindAR**: Biblioteca para realidade aumentada baseada em imagem

## Estrutura do Projeto

```
.
├── components/            # Componentes React reutilizáveis
│   ├── QRScanner.tsx      # Componente para leitura de QR code
│   ├── ModelViewer.tsx    # Componente para visualização 3D
│   ├── ModelSelector.tsx  # Componente para seleção de modelos 3D
│   ├── ARViewer.tsx       # Componente para visualização em realidade aumentada
│   └── ProductInfo.tsx    # Componente para informações do produto
├── Models/                # Gestão de modelos 3D
│   └── models.ts          # Definição e gestão de modelos disponíveis
├── pages/                 # Páginas da aplicação
│   ├── index.tsx          # Página inicial com scanner
│   ├── _app.tsx           # Componente principal da aplicação
│   ├── ar.tsx             # Página de realidade aumentada
│   └── produto/[id].tsx   # Página de detalhes do produto
├── public/                # Arquivos estáticos
│   ├── models/            # Modelos 3D (.ply)
│   │   └── thumbnails/    # Miniaturas dos modelos 3D
│   └── targets/           # Marcadores para realidade aumentada
├── styles/                # Estilos CSS
└── .cursor/               # Configurações do Cursor AI
    └── rules/             # Regras para o Cursor AI
```

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/Visitfoods/previewGT.git
cd previewGT
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## Preparação para Realidade Aumentada

Para usar a funcionalidade de realidade aumentada:

1. Acesse [MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)
2. Faça upload de uma imagem para ser usada como marcador (imagem com detalhes ou um código QR)
3. Compile e baixe o arquivo `.mind` gerado
4. Adicione o arquivo em `public/targets/target.mind`

## Notas Importantes

- A aplicação requer acesso à câmara do dispositivo para funcionar corretamente.
- Para a realidade aumentada funcionar, é necessário ter um arquivo de marcador (target.mind) válido.
- A aplicação deve ser executada em HTTPS ou localhost para que o acesso à câmara funcione corretamente.
- Para melhor experiência em dispositivos iOS, certifique-se de usar o Safari.
- O desempenho da realidade aumentada pode variar dependendo do dispositivo.

## Próximos Passos

- Implementar carregamento progressivo para modelos grandes
- Adicionar animações e efeitos visuais ao modelo 3D
- Implementar modo offline com Service Workers
- Optimizar desempenho em dispositivos de baixa capacidade
- Adicionar suporte para partilha nas redes sociais 
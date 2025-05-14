# Backlog

- [ ] Implementar carregamento progressivo para modelos grandes
- [ ] Adicionar animações e efeitos visuais ao modelo 3D
- [ ] Implementar modo offline com Service Workers
- [x] Adicionar suporte para upload de imagem como alternativa à câmara
- [ ] Adicionar suporte para partilha nas redes sociais

# Em curso

- [x] Implementar visualização em realidade aumentada (AR) com tracking de imagem
- [x] Optimizar desempenho em dispositivos de baixa capacidade
- [x] Implementar análise de métricas de utilização
- [x] Testar a aplicação em dispositivos móveis reais
- [x] Resolver problemas de compatibilidade com iOS
- [x] Corrigir erro no scanner QR em dispositivos móveis (e.on is not a function)
- [x] Resolver problema de visualização do código QR 
- [x] Substituir imagem SVG por JPG para maior compatibilidade
- [x] Adicionar biblioteca Mind-AR via CDN para implementação de AR sem instalação local
- [x] Corrigir erro "e.loadAsync is not a function" no carregamento do modelo 3D
- [x] Implementar fallback para modelos 3D quando não for possível carregar PLY
- [x] Adicionar botão de acesso direto à experiência AR
- [x] Atualizar imagem de referência para tracking AR com alta qualidade
- [x] Atualizar arquivo target.mind para corresponder à nova imagem de referência

# Concluídas

- [x] Configurar pasta .cursor/rules
- [x] Configurar rastreamento de eventos de utilizador
- [x] Adicionar suporte para diferentes modelos 3D
- [x] Criar página de visualização do produto
- [x] Implementar página inicial com scanner QR
- [x] Criar componente de visualização 3D usando Gaussian Splats
- [x] Adicionar modo de baixo desempenho para dispositivos menos potentes
- [x] Implementar controles de câmara (zoom, rotação)
- [x] Melhorar interface responsiva

# Notas

- A implementação do AR usando Mind-AR foi feita com scripts CDN para evitar problemas de instalação de dependências locais
- Para o tracking de imagem AR, foi utilizado o arquivo `.mind` correspondente à imagem card.png obtida do repositório oficial do Mind-AR
- Foi implementado um sistema de fallback para casos onde o carregamento do modelo 3D PLY falhe, mostrando um cubo 3D animado
- A página AR agora contém instruções de resolução de problemas para ajudar os utilizadores em caso de dificuldades
- A correção do erro "e.loadAsync is not a function" foi implementada verificando a existência da função antes de chamá-la

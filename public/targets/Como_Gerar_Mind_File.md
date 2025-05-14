# Como Gerar o Arquivo de Tracking para a Imagem

Para transformar a imagem `qrcode.jpg` em um arquivo de tracking `.mind`, siga estas instruções:

## Método Online (Recomendado)

1. Acesse o [MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)

2. Clique em "Choose Files" e selecione a imagem `public/imagetrace/qrcode.jpg`

3. Clique em "Compile" e aguarde o processamento (pode levar alguns segundos)

4. Quando concluído, clique em "Download" para baixar o arquivo `.mind` gerado

5. Renomeie o arquivo para `target.mind` e coloque-o na pasta `public/targets/`

## Arquivos Necessários

- Imagem de origem: `public/imagetrace/qrcode.jpg`
- Arquivo de destino: `public/targets/target.mind`

## Observações

- O arquivo `.mind` já contém as informações de tracking extraídas da imagem
- Não é necessário enviar a imagem original para o servidor, apenas o arquivo `.mind`
- O arquivo `.mind` deve estar disponível na pasta `public/targets/` para que o AR funcione corretamente

---

**Atenção**: O arquivo de tracking `.mind` deve estar no diretório public/targets/ com o nome **target.mind** para que o sistema de AR funcione corretamente. 
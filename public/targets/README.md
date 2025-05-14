# Instruções para Criar um Marcador AR

Para que a visualização em realidade aumentada funcione, é necessário criar um arquivo de marcador (.mind) para o MindAR.

## Como criar um marcador:

1. Acesse o site [MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/)

2. Faça upload de uma imagem que será utilizada como marcador (pode ser uma imagem que contenha um código QR ou qualquer outra imagem com bons pontos de referência)

3. Clique em "Compile" para gerar o arquivo .mind

4. Faça o download do arquivo gerado

5. Renomeie o arquivo para `target.mind` e coloque-o nesta pasta (`public/targets/`)

## Características de um bom marcador:

- Alta resolução
- Rico em detalhes e texturas
- Bom contraste
- Padrões assimétricos (evite padrões repetitivos)
- Evite imagens muito brilhantes ou reflexivas

## Exemplo:

Se você tiver uma imagem de um gelado ou um código QR impresso em uma embalagem, essa seria uma boa opção para usar como marcador. O modelo 3D será exibido quando a câmara identificar essa imagem.

Nota: Certifique-se de que o marcador seja facilmente reconhecível pela câmara e tenha boa iluminação. 
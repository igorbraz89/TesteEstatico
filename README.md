# Projeto de Testes Estáticos com Grunt
Utilização do Grunt aliado ao JSHint e o JSCR para realização de testes estáticos em scripts JS.

Para mais informações: https://github.com/igorbraz89/TesteEstatico/wiki

## Configure

#### 1) NodeJS
Instale o NodeJS em sua máquina. O ideal é que seja instalado sem a necessidade
do `sudo`. Depois de instalado digite `node --version` para verificar se está
tudo ok.

#### 2) NPM
O NPM é o gerenciador de pacotes do NodeJS. Ele normalmente já é instalado junto
com o node, para conferir basta digitar `npm --version` no seu terminal.

#### 3) Grunt
O Grunt é o Task Runner que orquestrará todo o projeto. Para instalá-lo digite
`npm install grunt-cli -g`. Depois de instalado teste com `grunt --version`.


## Install
Clone o projeto em sua máquina, na pasta que desejar.
Na raiz do projeto, digite os seguintes comandos:

- `npm install`; (Instala os pacotes necessários para o Grunt)

Obs.: `Você pode usar o GitHub desktop para clonar o projeto.`

Pronto, com isso todas as dependências serão instaladas e tudo estará
configurado para o desenvolvimento.

## Run
Para rodar o projeto basta digitar `grunt watch`. Dessa forma o processo de compilação das alterações é feita automáticamente.

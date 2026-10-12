# Mapa-Web

Aplicação web de rotas construída com **React**, **TypeScript** e **OpenLayers**. O usuário digita a origem e o destino, escolhe os endereços nas sugestões de autocompletar e o mapa desenha a rota de carro entre os dois pontos.

O projeto foi feito para estudar o consumo de APIs de geoprocessamento e a integração de uma biblioteca de mapas com o ciclo de vida de componentes React.

![Demonstração do Mapa-Web](docs/demo.png)

## Funcionalidades

- **Autocompletar de endereços**: a partir de 3 caracteres, busca sugestões na API de geocodificação do OpenRouteService.
- **Cálculo de rota**: assim que origem e destino são escolhidos, a rota de carro é pedida à API de direções.
- **Desenho da rota no mapa**: a geometria retornada é convertida de EPSG:4326 para EPSG:3857 e desenhada como uma camada vetorial sobre o mapa base do OpenStreetMap.
- **Componentização do mapa**: o mapa, as camadas (tile e vetor) e os controles (tela cheia) foram separados em componentes e hooks reutilizáveis.

## Tecnologias

| Camada | Ferramentas |
| --- | --- |
| Interface | React 19, TypeScript, styled-components |
| Mapa | OpenLayers, OpenStreetMap |
| APIs | OpenRouteService (geocodificação e rotas), Axios |

## Estrutura

```
src/
├── components/
│   ├── Map/            # Cria a instância do mapa OpenLayers
│   └── Search/         # Campos de origem/destino com autocompletar
├── hooks/
│   └── useRouteLayer   # Desenha e remove a camada da rota no mapa
├── Layers/             # Componentes de camada (TileLayer, VectorLayer)
├── Controls/           # Controles do mapa (tela cheia)
└── services/
    └── openrouteservice.ts  # Cliente Axios com a chave de API
```

## Como rodar

**Pré-requisitos:** Node.js 18+ e uma chave gratuita da API do [OpenRouteService](https://openrouteservice.org/dev/#/signup).

1. Clone o repositório e instale as dependências:

   ```bash
   git clone https://github.com/Guenrick/Mapa-Web.git
   cd Mapa-Web
   npm install
   ```

2. Crie um arquivo `.env` na raiz, a partir do `.env.example`, com a sua chave:

   ```
   REACT_APP_ORS_API_KEY=sua_chave_aqui
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

   A aplicação abre em `http://localhost:3000`.

> O arquivo `.env` está no `.gitignore` e não deve ser enviado ao repositório.

## Próximos passos

- Permitir escolher o modo de deslocamento (a pé, bicicleta), que o hook `useRouteLayer` já suporta.
- Exibir distância e tempo estimado da rota.
- Mover as chamadas à API para um backend, para que a chave não fique exposta no navegador.

## Autor

**Cauã Guenrick** · [LinkedIn](https://www.linkedin.com/in/caua-guenrick/) · [GitHub](https://github.com/Guenrick)

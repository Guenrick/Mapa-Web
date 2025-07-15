import React, { useState } from 'react';
import { Map as OlMap } from 'ol';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';

// --- Nossos componentes e hooks customizados ---

import Map from './components/Map/Map.tsx';
import Search from './components/Search/Search.tsx';
import { useRouteLayer } from './hooks/useRouteLayer.tsx';

// Fonte de tiles para o mapa com o estilo do Figma
const tileSource = new XYZ({
  url: 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png',
  attributions: [
    '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a>',
    '&copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a>',
    '&copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>',
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
  ],
});

// O componente App, agora com tipos (React.FC)
const App: React.FC = () => {
  // Estados com tipos explícitos
  const [center, setCenter] = useState<number[]>(fromLonLat([-44.0542, -19.9245])); // Coordenadas de Contagem/BH
  const [zoom, setZoom] = useState<number>(13);
  
  // Guarda as coordenadas da rota, que é um array de arrays de números
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);
  
  // Guarda a instância do mapa do OpenLayers
  const [mapInstance, setMapInstance] = useState<OlMap | null>(null);

  // Usamos nosso hook! Ele vai ouvir as mudanças em 'routeCoords' e desenhar no mapa.
  useRouteLayer(mapInstance, routeCoords, 'driving-car');

  return (
    <div>
      {/* Passamos uma função para o Search. Quando ele encontrar uma rota, 
        ele chamará essa função e nos dará a geometria, da qual pegamos as coordenadas.
      */}
      <Search onRouteFound={(geometry) => setRouteCoords(geometry.coordinates)} />

      {/* O componente Map precisa nos devolver a instância do mapa que ele cria.
        Ele também recebe a fonte de tiles que definimos acima.
      */}
      <Map 
        center={center} 
        zoom={zoom} 
        setMap={setMapInstance} 
        tileSource={tileSource} 
      />
    </div>
  );
};

export default App;
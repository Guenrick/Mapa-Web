import React, { useContext, useEffect } from 'react';
import { Tile as TileLayer_ol } from 'ol/layer'; // Renomeado para evitar conflito de nome
import { Tile as TileSource } from 'ol/source'; // ALTERAÇÃO AQUI: Importamos o tipo específico
import { Map as OlMap } from 'ol';
import MapContext from '../components/Map/MapContext';

// Definindo os tipos
interface MapContextType {
  map: OlMap;
}

interface TileLayerProps {
  source: TileSource; // ALTERAÇÃO AQUI: Usamos o tipo específico
  zIndex?: number; // '?' torna a prop opcional
}

const TileLayer: React.FC<TileLayerProps> = ({ source, zIndex = 0 }) => {
  const { map } = useContext(MapContext) as MapContextType;

  useEffect(() => {
    if (!map) return;

    // Criamos a camada do OpenLayers com as props recebidas
    const tileLayer = new TileLayer_ol({
      source,
      zIndex,
    });

    // Usamos o método público para adicionar a camada
    map.addLayer(tileLayer);

    // Função de limpeza para remover a camada
    return () => {
      if (map) {
        map.removeLayer(tileLayer);
      }
    };
  }, [map, source, zIndex]);

  // Componente não renderiza nada visualmente
  return null;
};

export default TileLayer;
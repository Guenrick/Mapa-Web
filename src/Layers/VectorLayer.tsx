import React, { useContext, useEffect } from 'react';
import { Vector as VectorLayer_ol } from 'ol/layer'; // Renomeado para evitar conflito
import { Vector as VectorSource } from 'ol/source';
import { StyleLike } from 'ol/style/Style';
import { Map as OlMap } from 'ol';
import MapContext from '../components/Map/MapContext'; // caminho corrigido

// Definindo os tipos
interface MapContextType {
  map: OlMap;
}

interface VectorLayerProps {
  source: VectorSource;
  style: StyleLike;
  zIndex?: number;
}

const VectorLayer: React.FC<VectorLayerProps> = ({ source, style, zIndex = 0 }) => {
  const { map } = useContext(MapContext) as MapContextType;

  useEffect(() => {
    if (!map) return;

    const vectorLayer = new VectorLayer_ol({
      source,
      style,
      zIndex,
    });

    map.addLayer(vectorLayer);

    return () => {
      if (map) {
        map.removeLayer(vectorLayer);
      }
    };
  }, [map, source, style, zIndex]);

  return null;
};

export default VectorLayer;
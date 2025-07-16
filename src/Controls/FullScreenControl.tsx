import React, { useContext, useEffect } from 'react';
import { FullScreen } from 'ol/control';
import { Map as OlMap } from 'ol';
import MapContext from '../components/Map/MapContext';

interface MapContextType {
  map: OlMap;
}

const FullScreenControl: React.FC = () => {
  const { map } = useContext(MapContext) as MapContextType;

  useEffect(() => {
    if (!map) return;

    const fullScreenControl = new FullScreen();
    
    // Usei o método público para adicionar o controle
    map.addControl(fullScreenControl);

    // Função de limpeza
    return () => {
      map.removeControl(fullScreenControl);
    };
  }, [map]);

  return null;
};

export default FullScreenControl;
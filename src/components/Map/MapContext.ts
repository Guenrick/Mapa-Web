import React from 'react';
import { Map as OlMap } from 'ol';

export interface MapContextType {
  map: OlMap;
}

const MapContext = React.createContext<MapContextType | null>(null);

export default MapContext;
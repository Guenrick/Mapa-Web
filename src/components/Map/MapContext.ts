import React from 'react';
import { Map as OlMap } from 'ol';

// 1. Definimos a "forma" do nosso contexto aqui
export interface MapContextType {
  map: OlMap;
}

// 2. Passamos essa forma para o createContext, dizendo que ele pode ser desse tipo OU nulo.
const MapContext = React.createContext<MapContextType | null>(null);

export default MapContext;
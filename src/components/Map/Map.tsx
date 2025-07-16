import React, { useRef, useState, useEffect, ReactNode } from "react";
import "./Map.css";
import { Map as OlMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
// Renomeei o Tile pra TileSource para maior clareza
import { Tile as TileSource } from "ol/source";

// Descreve as props que o componente Map espera receber
interface MapProps {
  children?: ReactNode; 
  zoom: number;
  center: number[];
  tileSource: TileSource; 
  setMap: (map: OlMap) => void; // Função que recebe a instância do mapa
}

const Map: React.FC<MapProps> = ({ children, zoom, center, setMap, tileSource }) => {
  const mapRef = useRef<HTMLDivElement>(null); 
  const [map, setInternalMap] = useState<OlMap | null>(null); // O estado do mapa

  // Efeito para criar o mapa quando o componente é montado
  useEffect(() => {
    if (!mapRef.current) return; // Garante que a div do mapa existe

    // Cria a camada base do mapa com a fonte de tiles 
    const baseLayer = new TileLayer({
      source: tileSource,
    });

    // Opções de configuração do mapa
    const options = {
      view: new View({ zoom, center }),
      layers: [baseLayer], // Adiciona a camada base na criação
      controls: [],
      overlays: [],
    };

    // Cria o objeto do mapa e o anexa à nossa div
    const mapObject = new OlMap(options);
    mapObject.setTarget(mapRef.current);
    
    // Guarda a instância do mapa no estado interno
    setInternalMap(mapObject);
    
    // Devolve a instância para o componente pai (App.tsx)
    setMap(mapObject);

    // Função de limpeza para quando o componente for desmontado
    return () => mapObject.setTarget(undefined);
  }, [center, zoom, setMap, tileSource]); // Adicionamos as dependências

  return (
    <div ref={mapRef} className="ol-map">
      {}
      {children}
    </div>
  );
};


export default Map;
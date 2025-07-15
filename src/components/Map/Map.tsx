import React, { useRef, useState, useEffect, ReactNode } from "react";
import "./Map.css"; // Certifique-se de que este arquivo existe ou remova a linha
import { Map as OlMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
// ALTERAÇÃO AQUI: Importamos o tipo 'Tile' e o renomeamos para 'TileSource' para maior clareza
import { Tile as TileSource } from "ol/source";

// --- Definição dos Tipos ---

// Descreve as props que o componente Map espera receber
interface MapProps {
  children?: ReactNode; // 'children' é o tipo padrão para componentes aninhados
  zoom: number;
  center: number[];
  // ALTERAÇÃO AQUI: Usamos o tipo específico 'TileSource' em vez do genérico 'Source'
  tileSource: TileSource; 
  setMap: (map: OlMap) => void; // Uma função que recebe a instância do mapa
}

// --- Componente Principal ---

const Map: React.FC<MapProps> = ({ children, zoom, center, setMap, tileSource }) => {
  const mapRef = useRef<HTMLDivElement>(null); // Tipamos a referência para um elemento Div
  const [map, setInternalMap] = useState<OlMap | null>(null); // O estado do mapa

  // Efeito para criar o mapa quando o componente é montado
  useEffect(() => {
    if (!mapRef.current) return; // Garante que a div do mapa já existe

    // Cria a camada base do mapa com a fonte de tiles que recebemos
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
      {/* Renderiza componentes filhos, como os controles do mapa, se houver */}
      {children}
    </div>
  );
};

export default Map;
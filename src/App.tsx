import React, { useState } from 'react';
import { Map as OlMap } from 'ol';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import Map from './components/Map/Map.tsx';
import Search from './components/Search/Search.tsx';
import { useRouteLayer } from './hooks/useRouteLayer.tsx';

const tileSource = new OSM();

const App: React.FC = () => {
  const [center, setCenter] = useState<number[]>(fromLonLat([-44.0542, -19.9245]));
  const [zoom, setZoom] = useState<number>(13);
  const [routeCoords, setRouteCoords] = useState<number[][] | null>(null);
  const [mapInstance, setMapInstance] = useState<OlMap | null>(null);

  useRouteLayer(mapInstance, routeCoords, 'driving-car');

  return (
    <div className="App">
      <Search onRouteFound={(geometry) => setRouteCoords(geometry.coordinates)} />
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
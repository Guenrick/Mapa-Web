import { useEffect } from 'react';
import { Map as OlMap } from 'ol';
import { LineString } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Style, Stroke } from 'ol/style';

// Helper function
const getColorForTravelMode = (mode: string): string => {
  switch (mode) {
    case 'driving-car': return '#4285F4';
    case 'foot-walking': return '#0F9D58';
    case 'cycling-regular': return '#EA4335';
    default: return '#000000';
  }
};

// A PALAVRA 'EXPORT' AQUI É A PARTE MAIS IMPORTANTE
export const useRouteLayer = (
  map: OlMap | null,
  coordinates: number[][] | null,
  travelMode: string
) => {
  useEffect(() => {
    if (!map || !coordinates) return;

    const lineString = new LineString(coordinates).transform('EPSG:4326', 'EPSG:3857');
    const feature = new Feature({
      geometry: lineString,
    });

    const vectorSource = new VectorSource({
      features: [feature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: getColorForTravelMode(travelMode),
          width: 5,
        }),
      }),
      zIndex: 10
    });

    map.addLayer(vectorLayer);

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, coordinates, travelMode]);
};
import React, { useState, useEffect, FC } from 'react';
import styled from 'styled-components';
import apiClient from '../../services/openrouteservice.ts';

// Formatacao das caixas
const RouteContainer = styled.div`
  position: absolute;
  top: 5%;
  left: 3%;
  z-index: 1000;
  background: white;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  padding: 20px;
`;
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  position: relative;
`;
const Label = styled.label`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 5px;
  color: #333;
`;
const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 17px;
  width: 100%;
  box-sizing: border-box;
`;
const SuggestionsContainer = styled.ul``;
const SuggestionItem = styled.li``;

interface SuggestionFeature {
  properties: { id: string; label: string; };
  geometry: { coordinates: number[]; };
}

interface ApiResponse {
  features: SuggestionFeature[];
}

interface SearchProps {
  onRouteFound: (geometry: any) => void;
}

// --- Componente Principal ---
const Search: FC<SearchProps> = ({ onRouteFound }) => {
  // AQUI DEFINIMOS OS ESTADOS (resolvemos o "Cannot find name 'setOriginSuggestions'")
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [originSuggestions, setOriginSuggestions] = useState<SuggestionFeature[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<SuggestionFeature[]>([]);
  const [originCoords, setOriginCoords] = useState<number[] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<number[] | null>(null);

  const fetchSuggestions = async (query: string, field: 'origin' | 'destination') => {
    if (query.length < 3) {
      field === 'origin' ? setOriginSuggestions([]) : setDestinationSuggestions([]);
      return;
    }
    try {
      const response = await apiClient.get<ApiResponse>('v2/geocode/autocomplete', {
        params: { text: query }
      });

      if (response.data && Array.isArray(response.data.features)) {
        if (field === 'origin') {
          setOriginSuggestions(response.data.features);
        } else {
          setDestinationSuggestions(response.data.features);
        }
      } else {
        field === 'origin' ? setOriginSuggestions([]) : setDestinationSuggestions([]);
      }
    } catch (error) {
      console.error("Falha na chamada de autocomplete:", error);
    }
  };
  
  const handleSuggestionClick = (suggestion: SuggestionFeature, field: 'origin' | 'destination') => {
    const locationName = suggestion.properties.label;
    const coordinates = suggestion.geometry.coordinates;

    if (field === 'origin') {
      setOrigin(locationName);
      setOriginCoords(coordinates);
      setOriginSuggestions([]);
    } else {
      setDestination(locationName);
      setDestinationCoords(coordinates);
      setDestinationSuggestions([]);
    }
  };

  useEffect(() => {
    if (originCoords && destinationCoords) {
      const fetchRoute = async () => {
        try {
          const response = await apiClient.get(`/v2/directions/driving-car`, {
            params: {
              start: originCoords.join(','),
              end: destinationCoords.join(','),
            }
          });
          const routeGeometry = response.data.features[0].geometry;
          onRouteFound(routeGeometry);
        } catch (error) {
          console.error("Erro ao buscar a rota:", error);
        }
      };
      fetchRoute();
    }
  }, [originCoords, destinationCoords]);


  return (
    <RouteContainer>
      <InputGroup>
        <Label htmlFor="origin">Origem</Label>
        <Input
          id="origin" type="text" placeholder="Digite o local de origem" value={origin}
          onChange={(e) => { setOrigin(e.target.value); fetchSuggestions(e.target.value, 'origin'); }}
          autoComplete="off"
        />
        {originSuggestions.length > 0 && (
          <SuggestionsContainer>
            {originSuggestions.map((s) => (
              <SuggestionItem key={s.properties.id} onClick={() => handleSuggestionClick(s, 'origin')}>
                {s.properties.label}
              </SuggestionItem>
            ))}
          </SuggestionsContainer>
        )}
      </InputGroup>

      <InputGroup>
        <Label htmlFor="destination">Destino</Label>
        <Input
          id="destination" type="text" placeholder="Digite o local de destino" value={destination}
          onChange={(e) => { setDestination(e.target.value); fetchSuggestions(e.target.value, 'destination'); }}
          autoComplete="off"
        />
        {destinationSuggestions.length > 0 && (
          <SuggestionsContainer>
            {destinationSuggestions.map((s) => (
              <SuggestionItem key={s.properties.id} onClick={() => handleSuggestionClick(s, 'destination')}>
                {s.properties.label}
              </SuggestionItem>
            ))}
          </SuggestionsContainer>
        )}
      </InputGroup>
    </RouteContainer>
  );
};

export default Search;
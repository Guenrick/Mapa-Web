import React, { useState, useEffect, FC } from 'react';
import styled from 'styled-components';
import apiClient from '../../services/openrouteservice.ts';

// --- Styled Components (sem alterações) ---
const RouteContainer = styled.div` /* ...código existente... */ `;
const InputGroup = styled.div` /* ...código existente... */ `;
const Label = styled.label` /* ...código existente... */ `;
const Input = styled.input` /* ...código existente... */ `;
const SuggestionsContainer = styled.ul` /* ...código existente... */ `;
const SuggestionItem = styled.li` /* ...código existente... */ `;

// --- Definições de Tipos (TypeScript) ---

// Descreve a estrutura de uma sugestão de local da API
interface SuggestionFeature {
  properties: {
    id: string;
    label: string;
  };
  geometry: {
    coordinates: number[];
  };
}

// Descreve as props que o nosso componente Search recebe
interface SearchProps {
  onRouteFound: (geometry: any) => void; // A geometria da rota
}

// --- Componente Principal ---

// Definimos o tipo do nosso componente como React.FC (Functional Component)
// e passamos o tipo de suas props
const Search: FC<SearchProps> = ({ onRouteFound }) => {
  // Estados com tipos explícitos
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');

  const [originSuggestions, setOriginSuggestions] = useState<SuggestionFeature[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<SuggestionFeature[]>([]);

  const [originCoords, setOriginCoords] = useState<number[] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<number[] | null>(null);

  // Função para buscar sugestões, agora com parâmetros tipados
  const fetchSuggestions = async (query: string, field: 'origin' | 'destination') => {
    if (query.length < 3) {
      field === 'origin' ? setOriginSuggestions([]) : setDestinationSuggestions([]);
      return;
    }
    try {
      const response = await apiClient.get('/v2/geocode/autocomplete', {
        params: { text: query }
      });
      const suggestions: SuggestionFeature[] = response.data.features;
      if (field === 'origin') {
        setOriginSuggestions(suggestions);
      } else {
        setDestinationSuggestions(suggestions);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    }
  };
  
  // Função para lidar com o clique, com parâmetros tipados
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

  // useEffect para buscar a rota
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


  // O JSX não muda nada
  return (
    <RouteContainer>
      {/* Campo de Origem */}
      <InputGroup>
        <Label htmlFor="origin">Origem</Label>
        <Input
          id="origin"
          type="text"
          placeholder="Digite o local de origem"
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            fetchSuggestions(e.target.value, 'origin');
          }}
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

      {/* Campo de Destino */}
      <InputGroup>
        <Label htmlFor="destination">Destino</Label>
        <Input
          id="destination"
          type="text"
          placeholder="Digite o local de destino"
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            fetchSuggestions(e.target.value, 'destination');
          }}
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
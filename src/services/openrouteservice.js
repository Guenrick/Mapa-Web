import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.openrouteservice.org',
  headers: {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use((config) => {
  // Acessaa a chave de API da variável de ambiente
  const apiKey = process.env.REACT_APP_ORS_API_KEY;

  // Adiciona a chave de API ao cabeçalho de autorização
  config.headers.Authorization = apiKey;

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Exporta para ser usada em outras partes do app
export default apiClient;
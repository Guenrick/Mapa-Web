import axios, { AxiosRequestHeaders } from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.openrouteservice.org',
});

apiClient.interceptors.request.use(
  (config) => {
    // Pega a chave da API do ambiente
    const apiKey = process.env.REACT_APP_ORS_API_KEY;

    // TESTE DECISIVO: VAMOS VER O QUE ESTÁ SENDO LIDO
    console.log("API Key sendo lida pelo serviço:", apiKey);

    if (!apiKey) {
      console.error("ERRO GRAVE: A variável REACT_APP_ORS_API_KEY está 'undefined'. Verifique o arquivo .env e REINICIE O SERVIDOR.");
      return Promise.reject(new Error("API Key is missing"));
    }

    const headers = config.headers as AxiosRequestHeaders;
    headers.Authorization = apiKey;
    config.headers = headers;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
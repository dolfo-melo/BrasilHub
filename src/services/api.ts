import axios from 'axios';

const api = axios.create({
    baseURL: 'https://brasilapi.com.br/api/ibge/municipios/v1/'
})

export default api
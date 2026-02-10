import axios from 'axios';

const populationApi = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/2022/variaveis/9324?localidades='
})

export default populationApi
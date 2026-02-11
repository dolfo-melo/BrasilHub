import axios from 'axios';

const populationApi = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v3/agregados/10089/periodos/2022/variaveis/93'
})

export default populationApi
import { useState } from 'react'
import  api from './services/api.ts'
import './App.css'

export default function App() {

  const [uf, setUf] = useState<string>('')
  const [municipios, setMunicipios] = useState([])
  const [erro, setErro] = useState<string>('')

  async function handleSearch() {
    try{
      setErro('')
      const response = await api.get(`${uf}?providers=dados-abertos-br,gov,wikipedia`)
      console.log(response)
      console.log(response.data)
      setMunicipios(response.data)
    }catch{
      setErro('Erro na pesquisa. Tente novamente!!')
      setUf('')
    }
  }

  return (
    <>
      <input 
        value={uf.toUpperCase()}
        onChange={e => setUf(e.target.value)}
        placeholder='Digite a sigla do seu estado'
      />
      <button onClick={handleSearch}>Pesquisar</button>
    </>
  )
}

import { useState } from 'react'
import  api from './services/api.ts'
import { CityCard, City } from './components/CityCard.tsx'
import './main.css'

export default function App() {

  const [uf, setUf] = useState<string>('')
  const [municipios, setMunicipios] = useState([])
  const [erro, setErro] = useState<string>('')

  async function handleSearch() {
    try{
      setErro('')
      const response = await api.get(`${uf}?providers=dados-abertos-br,gov,wikipedia`)
      setMunicipios(response.data)
      setUf('')
    }catch{
      setErro('Erro na pesquisa. Tente novamente!!')
      setUf('')
    }
  }

  function showResults(){
    return (
      <CityCard{City}/>
    )
  }

  return (
    <>
      <div className="container flex collumn justify-center align-center max-w-full h-100">
        <h1 className="text-5xl">Bem-vindo ao BrasilHub</h1>
      </div>
      <div className="container flex collumn justify-center align-center max-w-full h-100">
        <input 
          className="w-50 h-10"
          value={uf.toUpperCase()}
          onChange={e => setUf(e.target.value)}
          placeholder='Digite a sigla do seu estado'
        />
        <button className="w-50 h-10" onClick={handleSearch}>Pesquisar</button>
        {erro && <p className='erro'>{erro}</p>}
      </div>
      <div className="resultado flex flex-col-reverse justify-center align-center">
        <ul>
          {municipios.map((municipio: any) => (
            <div className="content flex justify-start align-center max-w-full h-50">
              <li key={municipio.id}>
                <h2>{municipio.nome}</h2>
                <h4>{municipio.codigo_ibge}</h4>
                <button onClick={showResults}>Saiba mais</button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}

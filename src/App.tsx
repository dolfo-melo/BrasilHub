import { useState } from 'react'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import  api from './services/api.ts'
import { CityCard }  from './components/CityCard.tsx'
import './main.css'

gsap.registerPlugin(useGSAP,ScrollTrigger);

export default function App() {

  const [uf, setUf] = useState<string>('')
  const [municipios, setMunicipios] = useState([])
  const [erro, setErro] = useState<string>('')

  // Função buscar cidades a partir do estado

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

  // Animações GSAP
  useGSAP(() => {
    
  })

  return (
    <>
      <div className="container flex collumn justify-center align-center max-w-full max-h-full gap-10">
        <div className="overflow-hidden">
          <h1 className=" text-5xl overflow-hidden">Bem-vindo ao BrasilHub</h1>
          <h3 className=" text-2xl overflow-hidden">Descubra as cidades brasileiras</h3>
        </div>
        <img src="../public/logoBrasilHub3.png" alt="logo" width={1500} height={1500}/>
      </div>
      
      
      <div className="flex flex-col justify-center items-center max-w-dvw max-h-dvh">
        <h1 className="text heading-text overflow-hidden">BrasilHub</h1>
        <div className="flex flex-col justify-center items-center w-dvw h-300">
          <input 
            className="w-50 h-10"
            value={uf.toUpperCase()}
            onChange={e => setUf(e.target.value)}
            placeholder='Digite a sigla do seu estado'
          />
          <button className="w-50 h-10" onClick={handleSearch}>Pesquisar</button>
          {erro && <p className='erro'>{erro}</p>}
        </div>
      
        <div className="resultado flex flex-col-reverse justify-center align-center max-w-dvw max-h-full">
          <ul>
            {municipios.map((municipio: any) => (
              <CityCard key={municipio.id} city={municipio} />
            ))}
          </ul>
        </div>
      </div>

    </>
  )
}

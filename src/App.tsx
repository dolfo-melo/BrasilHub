import { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import { CityCard }  from './components/CityCard.tsx'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import  api from './services/api.ts'
import './main.css'

gsap.registerPlugin(useGSAP,ScrollTrigger,ScrambleTextPlugin);

export default function App() {

  const [uf, setUf] = useState<string>('')
  
  // React Query para busca e paginação

  const {data: municipios} = useQuery({
    queryKey: ['municipios', uf],
    queryFn: async () => {
          const response = await api.get(`${uf}?providers=dados-abertos-br,gov,wikipedia`)
          return response.data
    },
    enabled: !!uf, // Somente executa quando uf tem valor válido
    staleTime: 5 * 60 * 1000, // 5 minutos de cache      
  }
  )

  // Animações GSAP
  useGSAP(() => {
    gsap.to(".text", {
      scrambleText: "BrasilHub",
      chars: "upperAndLowerCase",
      duration: 2,
      tweenLenght: true,
      ease: "power2.inOut",
      overwrite: "auto",
    }),
    gsap.to(".logo", {
      rotation: 10,
      duration: 4,
      ease: "power4.inOut",
      overwrite: "auto",
    })
  })

  return (
    <>
      <div className="container flex justify-center align-center max-w-full max-h-full gap-100">
        <div className="overflow-hidden">
          <div className="content flex flex-col justify-center items-center">
            <h1 className="text text-5xl overflow-hidden">BrasilHub</h1>
            <div className="content flex flex-col justify-center items-center gap-3">
              <h3 className="subtext text-2xl overflow-hidden">Descubra as cidades brasileiras</h3>
              <input 
                className="cursor-pointer text-start mt-4 p-2 rounded-md border-5 border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-80 h-15 text-2xl font-bold"
                value={uf.toUpperCase()}
                onChange={e => setUf(e.target.value)}
                placeholder='Digite a sigla do seu estado EX: SP'
              />
            </div>
          </div>
        </div>
        <img 
          src="../public/logoBrasilHub3.png"  
          className="logo" 
          alt="logo" 
          width={1000} 
          height={1000} 
          draggable={false} />
      </div>
      
      
      <div className="flex flex-col justify-center items-center max-w-dvw max-h-dvh">
        <div className="resultado flex flex-col-reverse justify-center align-center max-w-dvw max-h-full">
          <ul>
            {municipios?.map((municipio: any) => (
              <CityCard key={municipio?.id} city={municipio} />
            ))}
          </ul>
        </div>
      </div>

    </>
  )
}

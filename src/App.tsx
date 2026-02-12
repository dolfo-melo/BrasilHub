import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CityCard }  from './components/CityCard'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import  api from './services/api'
import './main.css'

gsap.registerPlugin(useGSAP,ScrollTrigger,ScrambleTextPlugin)

export default function App() {

  // Animações GSAP

  const tl = gsap.timeline({defaults: {ease: "power4.out"}});

  useGSAP(() => {
    gsap.to(".text", {
      scrambleText: "BrasilHub",
      chars: "upperAndLowerCase",
      duration: 2,
      tweenLenght: true,
      ease: "power2.inOut",
      overwrite: "auto",
    }),
    gsap.to(".subtext", {
      scrambleText: "Descubra as cidades brasileiras",
      chars: "upperAndLowerCase",
      duration: 2,
      tweenLenght: true,
      ease: "power2.inOut",
      overwrite: "auto",
    }),
    gsap.to(".logo", {
      rotation: 10,
      duration: 4,
      opacity: 0.9,
      ease: "power4.inOut",
      overwrite: "auto",
    }),
    tl.from(".logo", {
      xPercent: 100,
      opacity: 0.2,
      duration: 1,
      scale: 1.2,
      clipPath: "inset(0% 100% 0% 100%)",
    }),
    tl.fromTo(footerRef.current,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 5 },
    ),
    tl.fromTo(".resultsText", 
    { y: -30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8 }
  )
  })
  
  
  
  
  // React Query para busca e paginação
  const [uf, setUf] = useState<string>('')

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

  // Paginação simples para evitar sobrecarga de dados
  const [page, setPage] = useState(1)
  const pageSize = 15

  const firstPageIndex = (page - 1) * pageSize
  const lastPageIndex =  page * pageSize
  const municipiosPaginados = municipios?.slice(firstPageIndex,lastPageIndex)
  const totalPages = Math.ceil(municipios?.length / pageSize) || 1

  const gridRef = useRef(null);
  const footerRef = useRef(null);

// Animação de entrada dos resultados
useGSAP(() => {

  tl.fromTo(".cityCardWapper", 
    { y: 50, opacity: 0, scale: 0.9 }, 
    { 
      y: 0, 
      opacity: 1, 
      scale: 1, 
      duration: 1.5, 
      stagger: 0.05,
    }, 
  );
}, [municipiosPaginados]);

return (
    <>
      <div className="container flex justify-center align-center max-w-full max-h-full gap-100 overflow-hidden">
        <div className="overflow-hidden">
          <div className="content flex flex-col justify-center items-center rounded-lg p-10 gap-5">
            <h1 className="text overflow-hidden text-green-600 text-shadow-md text-shadow-black cursor-pointer"></h1>
            <div className="mainInput content flex flex-col justify-center items-center gap-3 bg-blue-400 max-h-50 p-10 rounded-4xl max-w-100 ">
              <h3 className="subtext text-2xl overflow-hidden text-amber-50 font-bold cursor-pointer"></h3>
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
          draggable={false} />
      </div>
      
      {municipios?.length > 0 && (
        <div className="w-full min-h-screen flex flex-col items-center bg-green-500">
          <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 gap-15">
            <h1 className="resultsText text-7xl font-black text-white drop-shadow-lg overflow-hidden">Resultado</h1>
          
            {/* Container Resultados */}
            <div className="cityCardWapper w-full max-w-screen max-h-screen flex flex-col items-center">
              <ul className="grid grid-cols-1 text-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-9xl" ref={gridRef}>
                {municipiosPaginados?.map((municipio: any) => (
                  <li className="">
                    <CityCard key={municipio?.id} city={municipio} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Controle de Paginação */}
        
            {municipios?.length > 0 && (
              <div className="mt-16 flex justify-center items-center gap-8 bg-yellow-300 p-4 rounded-2xl shadow-2xl border border-white/10  w-80 h-20">
                <button 
                  className="text-2xl text-blue-400 hover:text-blue-400 disabled:opacity-30 transition-all font-bold"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >⬐</button>
                <span 
                  className="text-2xl text-blue-400 font-bold"
                >{page}/{totalPages}</span>
                <button 
                  className="text-2xl text-blue-400 hover:text-blue-400 disabled:opacity-30 transition-all font-bold"
                  onClick={() => setPage(p => (p < totalPages ? p + 1 : p))}
                  disabled={page >= totalPages}
                >⬏</button>
              </div>
            )}
            <footer className="text-center mt-10 mb-5 w-full" ref={footerRef}>
              <h1 className="text-5xl text-blue-900 h-100 font-bold overflow-hidden">Desenvolvido por <a href="https://dolfo-melo.com.br/">Rodolfo Melo</a></h1>
            </footer>
            </div>
        </div>
      )}
    </>
  )
}

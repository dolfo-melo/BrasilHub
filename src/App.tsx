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
      xPercent: 50,
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
      <div className=" container relative min-w-dvw w-full min-h-8/12 flex flex-col-reverse lg:flex-row items-center justify-center gap-60 overflow-hidden">
        <div className="z-10 w-full lg:w-1/2 flex flex-col items-center lg:items-end transition-all duration-500 overflow-hidden">
          <div className="z-10 w-screen flex flex-col items-center sm:w-6/12 md:w-8/12 lg:w-12/12 justify-end transition-all duration-500 ease-in-out">
            <h1 className="text overflow-hidden text-green-600 text-shadow-md text-shadow-black cursor-pointer sm:text-3xl md:text-5xl lg:text-8xl"></h1>
            <div className="mainInput content flex flex-col justify-start items-center gap-3 bg-blue-400 sm:max-h-50 w-60 text-2xl  lg:max-h-60 p-10 rounded-4xl max-w-100">
              <h3 className="subtext text-white text-xl md:text-2xl font-bold mb-2 text-center cursor-pointer"></h3>
              <input 
                className="w-full h-10 p-4 rounded-xl border-4 border-gray-700 text-center text-2xl font-bold focus:ring-4 focus:ring-yellow-500 outline-none transition-all uppercase"
                value={uf.toUpperCase()}
                onChange={e => setUf(e.target.value)}
                placeholder='Digite a sigla do seu estado EX: SP'
              />
            </div>
          </div>
        </div>
        <div className="inset-0 z-0 overflow-hidden">
          <img 
            src="/logoBrasilHub.png"  
            className="logo w-4/12 sm: flex justify-end items-end lg:w-10/12 object-contain" 
            alt="logo"  
            draggable={false} />
        </div>
      </div>
      
      {municipios?.length > 0 && (
        <div className="w-full min-h-screen flex flex-col items-center bg-green-500">
          <div className="w-full flex flex-col items-center pt-10 pb-20 px-4 gap-15">
            <h1 className="resultsText text-7xl font-black text-white drop-shadow-lg overflow-hidden">Resultado</h1>
          
            {/* Container Resultados */}
            <div className="cityCardWapper w-full max-w-screen max-h-screen flex flex-col items-center">
              <ul className="grid grid-cols-1 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 w-9xl" ref={gridRef}>
                {municipiosPaginados?.map((municipio: any) => (
                  <li className="sm: items-start h-50">
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

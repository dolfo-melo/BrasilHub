import { useState } from "react"
import populationApi from "../services/populationApi"
import type { City } from "../types/City"
import type { IBGEResponse } from "../types/IBGEResponse"


interface CityCardProps {
    city: City
}

export function CityCard({city} : CityCardProps){
    const [populacao, setPopulacao] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const [erroPop, setErroPop] = useState<string>("")

    // Função Saiba Mais
    async function handleSearchPopulation(){
        if(populacao) return;

        setLoading(true)
        setErroPop("")
        try{
            const popuResponse =  await populationApi.get(`?localidades=N6[${city.codigo_ibge}]&classificacao=1[6795]`)
        
            const popuData = (popuResponse.data) as IBGEResponse[]
            const popuValue = popuData[0].resultados[0].series[0]?.serie["2022"]
            if (popuValue){
                setPopulacao(popuValue)
            } 
        } catch {
           setErroPop("Error ao buscar dados")
        } finally {
            setLoading(false)
        }
    }

    return (
            <div className="w-full h-30 flex-col bg-blue-700 hover:bg-blue-600 border-l-8 border-yellow-500 rounded-xl shadow-lg transition-all flex justify-around items-center group">
                <h3 className="font-bold text-1xl text-yellow-300">{city.nome}</h3>
                <div className="mt-2">
                    {populacao ? (
                        <span className="text-green-300 font-bold">
                            {parseInt(populacao).toLocaleString('pt-BR')} habitantes
                        </span>
                    ) : (
                        <>
                            <button 
                                onClick={handleSearchPopulation}
                                disabled={loading}
                                className="text-white text-1xl font-bold hover:underline disabled:text-gray-400"
                                >
                                {loading ? "Carregando..." : "Ver População"}
                            </button>
                            {erroPop && <p className="text-red-300 text-xs mt-1">{erroPop}</p>}
                        </>
                    )}
                </div>    
            </div>
    )
}
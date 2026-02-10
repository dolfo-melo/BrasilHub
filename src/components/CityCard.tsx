import { useState } from "react";
import populationApi from "../services/populationApi";
import type { City } from "../types/City";

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

        setLoading(true);
        setErroPop("")
        try{
            const popuResponse =  await populationApi.get(`N6[${city.codigo_ibge}]`)
        
            const popuData = popuResponse.data

            const popuValue = popuData.resultados.series.serie['2022']

            if (popuValue){
                setPopulacao(popuValue);
            } 
        } catch {
           setErroPop("Error ao buscar dados")
        } finally {
            setLoading(false)
        }
    }

    return (
                <div className="p-4 border rounded shadow bg-white my-2">
            <h3 className="font-bold text-lg">{city.nome}</h3>
            <div className="mt-2">
                {populacao ? (
                    <span className="text-green-600 font-bold">
                        {parseInt(populacao).toLocaleString('pt-BR')} habitantes
                    </span>
                ) : (
                    <>
                        <button 
                            onClick={handleSearchPopulation}
                            disabled={loading}
                            className="text-blue-500 hover:underline disabled:text-gray-400"
                        >
                            {loading ? "Carregando..." : "Ver População"}
                        </button>
                        {erroPop && <p className="text-red-500 text-xs mt-1">{erroPop}</p>}
                    </>
                )}
            </div>
        </div>
    )
}
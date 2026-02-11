export interface IBGEResponse{
    id:string;
    resultados: Array<{
            series: Array<{
                serie: Record<string, string>,
        }>;
    }>;
}
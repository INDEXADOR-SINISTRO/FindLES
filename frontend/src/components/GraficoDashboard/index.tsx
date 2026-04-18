import { graficoDto } from '@/types/consulta';

type GraficosDashboardProps = {
    dados: graficoDto[];
};

export default function GraficoDashboard({ dados }: GraficosDashboardProps) {

    const dadosLimitados = dados.slice(0, 7);


    const maxConsultas = Math.max(...dadosLimitados.map((d) => d.totalConsultas)) || 1;
    const maxTempo = Math.max(...dadosLimitados.map((d) => d.tempoMedio)) || 1;

    const formatarData = (dataString: string) => {
        const [ano, mes, dia] = dataString.split('-');
        return `${dia}/${mes}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full ">

            {/* GRÁFICO 1: Consultas por dia */}
            <div>
                <h3 className="text-[#898989] font-medium">
                    Consultas por dia (últimos 7 dias)
                </h3>

                {/* Caixa bege do gráfico */}
                <div className="bg-[#EBE9E1] border border-[#898989] h-40 px-4 pt-8 pb-2 flex items-end justify-between gap-3">
                    {dadosLimitados.map((item, index) => {
                        // Calcula a altura da barra em porcentagem baseada no maior dia
                        const altura = (item.totalConsultas / maxConsultas) * 100;

                        return (
                            <div key={`consultas-${index}`} className="relative group w-full h-full flex items-end justify-center">

                                {/* Tooltip (Balão flutuante no hover) */}
                                <div className="absolute -top-8 bg-[#444340] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {item.totalConsultas} consultas ({formatarData(item.data)})
                                </div>

                                {/* A Barra */}
                                
                                    <div
                                        className="w-full bg-[#3f3f3f] relative group-hover:bg-[#5a5956] transition-colors duration-200"
                                        style={{ height: `${altura}%` }}
                                    >
                                        
                                    </div>

                                    
                                    
                                

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* GRÁFICO 2: Tempo médio por dia */}
            <div>
                <h3 className="text-[#898989] font-medium">
                    Tempo médio de resposta por dia (últimos 7 dias)
                </h3>

                {/* Caixa bege do gráfico */}
                <div className="bg-[#EBE9E1] border border-[#898989] h-40 px-4 pt-8 pb-2 flex items-end justify-between gap-3">
                    {dadosLimitados.map((item, index) => {
                        // Calcula a altura da barra em porcentagem baseada no maior tempo
                        const altura = (item.tempoMedio / maxTempo) * 100;

                        return (
                            <div key={`tempo-${index}`} className="relative group w-full h-full flex items-end justify-center">

                                {/* Tooltip (Balão flutuante no hover) */}
                                <div className="absolute -top-8 bg-[#444340] text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                    {item.tempoMedio.toFixed(1)} ms ({formatarData(item.data)})
                                </div>

                                {/* A Barra */}
                                <div
                                    className="w-full bg-[#3f3f3f] group-hover:bg-[#5a5956] transition-colors duration-200"
                                    style={{ height: `${altura}%` }}
                                ></div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
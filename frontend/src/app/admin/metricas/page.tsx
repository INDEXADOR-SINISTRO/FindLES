"use client";

import GraficoDashboard from "@/components/GraficoDashboard";
import Button from "@/components/widgets/Button";
import Input from "@/components/widgets/input";
import { useSnackbar } from "@/components/widgets/snackbar";
import { consultaService } from "@/lib/services/consulta";
import { metricasDto } from "@/types/consulta";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

// ==========================================
// NOVO COMPONENTE: O Contador Animado
// ==========================================
type NumeroAnimadoProps = {
  valor?: number;
  isDecimal?: boolean;
  sufixo?: string;
};

function NumeroAnimado({ valor = 0, isDecimal = false, sufixo = "" }: NumeroAnimadoProps) {
  const [exibicao, setExibicao] = useState(0);

  useEffect(() => {
    let inicioTempo: number | null = null;
    const duracao = 800; // Duração da animação (0.8 segundos)
    const valorInicial = exibicao;
    const diferenca = valor - valorInicial;

    // Se o valor for o mesmo, não precisa animar
    if (diferenca === 0) return;

    const animarNumero = (tempoAtual: number) => {
      if (!inicioTempo) inicioTempo = tempoAtual;
      const progresso = Math.min((tempoAtual - inicioTempo) / duracao, 1);
      
      // Curva Ease-out (rápido no começo, suave no fim)
      const facilidade = 1 - Math.pow(1 - progresso, 4);
      
      setExibicao(valorInicial + diferenca * facilidade);

      if (progresso < 1) {
        window.requestAnimationFrame(animarNumero);
      } else {
        setExibicao(valor); // Crava o número exato no final
      }
    };

    window.requestAnimationFrame(animarNumero);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]); // Roda toda vez que o valor mudar (ex: ao trocar a data)

  const formatado = isDecimal ? exibicao.toFixed(1) : Math.round(exibicao);

  return <span>{formatado} {sufixo}</span>;
}

const Metricas = () => {
  const [metricas, setMetricas] = useState<metricasDto>();
  const [dataDe, setDataDe] = useState("");
  const [dataAte, setDataAte] = useState("");

  const { showMessage } = useSnackbar();

  const getMetricas = async (dataDe: string, dataAte: string) => {
    try {
      const response = await consultaService.getMetricas(dataDe, dataAte);
      setMetricas(response);
    } catch (error) {
      showMessage({ message: "Erro ao buscar métricas", type: "error" });
    }
  };

  useEffect(() => {
    getMetricas(dataDe, dataAte);
  }, [dataDe, dataAte]);

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <div>
          <h1 className="text-3xl mb-2">Métricas de desempenho</h1>
          <hr className="text-[#685A22] mb-2" />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-58">
            <Input
              id="dataDe"
              onChange={(e) => setDataDe(e.target.value)}
              type="date"
              label="Data - DE"
              value={dataDe}
              className="text-[#7e7d77] text-xs"
            />
          </div>
          <div className="flex flex-col gap-1 w-58">
            <Input
              id="dataAte"
              onChange={(e) => setDataAte(e.target.value)}
              type="date"
              label="Data - ATÉ"
              value={dataAte}
              className="text-[#7e7d77] text-xs"
            />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex gap-4">
          
          <div className="flex-col w-1/3 h-40 shadow-md bg-[#EBE9E1] border border-[#898989] flex justify-center items-center">
            <p className="text-2xl font-semibold text-[#3f3f3f]">
              <NumeroAnimado valor={metricas?.totalConsultas ?? 0} />
            </p>
            <p className="text-[#898989]">Consultas realizadas</p>
          </div>
          
          <div className="flex-col w-1/3 h-40 shadow-md bg-[#EBE9E1] border border-[#898989] flex justify-center items-center">
            <p className="text-2xl font-semibold text-[#3f3f3f]">
              <NumeroAnimado valor={metricas?.mediaTempoResposta ?? 0} isDecimal={true} sufixo="ms" />
            </p>
            <p className="text-[#898989]">Tempo médio de resposta</p>
          </div>
          
          <div className="flex-col w-1/3 h-40 shadow-md bg-[#EBE9E1] border border-[#898989] flex justify-center items-center">
            <p className="text-2xl font-semibold text-[#3f3f3f]">
              <NumeroAnimado valor={metricas?.mediaResultadosBusca ?? 0} isDecimal={true} />
            </p>
            <p className="text-[#898989]">Média de resultados por consulta</p>
          </div>

        </div>

        <div className="flex gap-4">
          
          <div className="flex-col w-1/2 h-40 shadow-md bg-[#EBE9E1] border border-[#898989] flex justify-center items-center">
            <p className="text-2xl font-semibold text-[#3f3f3f]">
              <NumeroAnimado valor={metricas?.consultasSemResultado ?? 0} />
            </p>
            <p className="text-[#898989]">Consultas sem resultado</p>
          </div>
          
          <div className="flex-col w-1/2 h-40 shadow-md bg-[#EBE9E1] border border-[#898989] flex justify-center items-center">
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((estrelaAtual) => {
                const valorParaMostrar = metricas?.avaliacaoMedia ?? 0;
                let preenchimento = (valorParaMostrar - estrelaAtual + 1) * 100;
                preenchimento = Math.max(0, Math.min(100, preenchimento));

                return (
                  <div key={estrelaAtual} className="relative w-6 h-6">
                    <StarIcon className="absolute top-0 left-0 w-6 h-6 text-[#898989]" />
                    <div
                      className="absolute top-0 left-0 h-full overflow-hidden transition-all duration-700 ease-out"
                      style={{ width: `${preenchimento}%` }}
                    >
                      <StarIcon className="w-6 h-6 text-amber-400 max-w-none" />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-2xl font-semibold text-text-[#3f3f3f]">
              <NumeroAnimado valor={metricas?.avaliacaoMedia ?? 0} isDecimal={true} />
            </p>
            <p className="text-[#898989]">Avaliação média de relevância</p>
          </div>

        </div>

        {metricas?.grafico && (
          <GraficoDashboard dados={metricas.grafico.toReversed()} />
        )}

      </div>
    </div>
  );
};

export default Metricas;
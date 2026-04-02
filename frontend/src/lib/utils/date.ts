export const formatarDataHora = (dataIso: string): string => {
  if (!dataIso) return "Data inválida";
  
  const data = new Date(dataIso);
  
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' às'); 
};
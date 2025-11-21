/**
 * Utilitários de formatação para o CRM
 * Locale: pt-BR, Moeda: BRL, Timezone: America/Sao_Paulo
 */

/**
 * Formata valor monetário em centavos para BRL
 */
export const formatCurrency = (centavos: number | null | undefined): string => {
  if (centavos === null || centavos === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(centavos / 100);
};

/**
 * Formata data para o formato brasileiro
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
};

/**
 * Formata data e hora para o formato brasileiro
 */
export const formatDateTime = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

/**
 * Formata telefone brasileiro
 */
export const formatPhone = (phone: string | null | undefined): string => {
  if (!phone) return '-';
  
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '');
  
  // Formata conforme o tamanho
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

/**
 * Normaliza telefone para formato E.164 (quando possível)
 */
export const normalizePhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, '');
  
  // Se tem 11 ou 10 dígitos, adiciona +55
  if (numbers.length === 11 || numbers.length === 10) {
    return `+55${numbers}`;
  }
  
  return phone;
};

/**
 * Converte BRL string para centavos (integer)
 */
export const parseCurrency = (value: string): number => {
  const numbers = value.replace(/[^\d,]/g, '').replace(',', '.');
  return Math.round(parseFloat(numbers) * 100);
};

/**
 * Formata porcentagem
 */
export const formatPercentage = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(1)}%`;
};

/**
 * Calcula dias entre duas datas
 */
export const daysBetween = (date1: string | Date, date2: string | Date): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Labels para origens de lead
 */
export const LEAD_ORIGINS = {
  platform: 'Plataforma',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  indicacao: 'Indicação',
  ligacao: 'Ligação',
  email: 'E-mail',
  outros: 'Outros'
} as const;

/**
 * Labels para status de lead
 */
export const LEAD_STATUS = {
  active: 'Ativo',
  contacted: 'Contatado',
  qualified: 'Qualificado',
  unqualified: 'Não Qualificado',
  converted: 'Convertido',
  lost: 'Perdido'
} as const;

/**
 * Labels para tipos de interação
 */
export const INTERACTION_TYPES = {
  whatsapp: 'WhatsApp',
  ligacao: 'Ligação',
  email: 'E-mail',
  visita: 'Visita',
  nota: 'Nota'
} as const;

/**
 * Cores para badges de status
 */
export const STATUS_COLORS = {
  active: 'bg-blue-500',
  contacted: 'bg-purple-500',
  qualified: 'bg-green-500',
  unqualified: 'bg-gray-500',
  converted: 'bg-emerald-600',
  lost: 'bg-red-500'
} as const;

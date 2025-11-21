import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook para verificar acesso ao CRM (APENAS para plano Premium)
 */
export const useCRMAccess = () => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkCRMAccess();
  }, []);

  const checkCRMAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('plan_type')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // CRM disponível APENAS para Premium
      const premiumAccess = profile?.plan_type === 'premium';
      setHasAccess(premiumAccess);

      if (!premiumAccess) {
        toast.error('O CRM é exclusivo do Plano Premium (R$ 87,90/mês)');
        navigate('/planos');
      }
    } catch (error) {
      console.error('Erro ao verificar acesso ao CRM:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return { hasAccess, isLoading };
};

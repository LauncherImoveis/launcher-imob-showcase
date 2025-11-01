import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const usePremiumCheck = () => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
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

      const premium = profile?.plan_type === 'premium';
      setIsPremium(premium);

      if (!premium) {
        toast.error('Este recurso é exclusivo do Plano Premium');
        navigate('/planos');
      }
    } catch (error) {
      console.error('Erro ao verificar status premium:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  return { isPremium, isLoading };
};

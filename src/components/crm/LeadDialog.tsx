import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const leadFormSchema = z.object({
  contact_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  contact_phone: z.string().min(10, 'Telefone inválido').max(20).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
  property_id: z.string().uuid().optional().or(z.literal('')),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadDialogProps {
  open: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  lead?: {
    id: string;
    contact_name: string;
    contact_phone: string | null;
    message: string | null;
    property_id: string | null;
  } | null;
}

interface Property {
  id: string;
  title: string;
}

export function LeadDialog({ open, onClose, lead }: LeadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const isEditing = !!lead;

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      contact_name: '',
      contact_phone: '',
      message: '',
      property_id: '',
    },
  });

  useEffect(() => {
    if (open) {
      loadProperties();
      if (lead) {
        form.reset({
          contact_name: lead.contact_name,
          contact_phone: lead.contact_phone || '',
          message: lead.message || '',
          property_id: lead.property_id || '',
        });
      } else {
        form.reset({
          contact_name: '',
          contact_phone: '',
          message: '',
          property_id: '',
        });
      }
    }
  }, [open, lead, form]);

  const loadProperties = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('title');

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return;
      }

      const leadData = {
        user_id: user.id,
        contact_name: data.contact_name.trim(),
        contact_phone: data.contact_phone?.trim() || null,
        message: data.message?.trim() || null,
        property_id: data.property_id || null,
      };

      if (isEditing && lead) {
        const { error } = await supabase
          .from('leads')
          .update(leadData)
          .eq('id', lead.id);

        if (error) throw error;
        toast.success('Lead atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('leads')
          .insert([leadData]);

        if (error) throw error;
        toast.success('Lead criado com sucesso');
      }

      onClose(true);
    } catch (error: any) {
      console.error('Erro ao salvar lead:', error);
      toast.error(error.message || 'Erro ao salvar lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Lead' : 'Novo Lead'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do lead'
              : 'Preencha os dados para criar um novo lead'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato *</FormLabel>
                  <FormControl>
                    <Input placeholder="João Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(11) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imóvel de Interesse</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um imóvel (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mensagem / Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o lead..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClose()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Atualizar' : 'Criar Lead'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

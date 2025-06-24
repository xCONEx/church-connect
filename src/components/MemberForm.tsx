
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member } from '@/types';
import { useToast } from '@/hooks/useToast';

const memberSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  cpf: z.string().min(11, 'CPF deve ter 11 dígitos'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  status: z.enum(['ativo', 'inativo', 'visitante', 'transferido']),
  joined_at: z.string().min(1, 'Data de ingresso é obrigatória'),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
}

const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: member ? {
      name: member.name,
      cpf: member.cpf,
      email: member.email,
      phone: member.phone,
      birth_date: member.birth_date,
      address: member.address,
      status: member.status,
      joined_at: member.joined_at,
    } : {
      status: 'ativo',
      joined_at: new Date().toISOString().split('T')[0],
    },
  });

  const handleFormSubmit = async (data: MemberFormData) => {
    try {
      await onSubmit(data);
      toast({
        title: "Sucesso!",
        description: `Membro ${member ? 'atualizado' : 'cadastrado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Digite o nome completo"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            {...register('cpf')}
            placeholder="000.000.000-00"
          />
          {errors.cpf && (
            <p className="text-sm text-red-600 mt-1">{errors.cpf.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="email@exemplo.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder="(00) 00000-0000"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="birth_date">Data de Nascimento</Label>
          <Input
            id="birth_date"
            type="date"
            {...register('birth_date')}
          />
          {errors.birth_date && (
            <p className="text-sm text-red-600 mt-1">{errors.birth_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
              <SelectItem value="visitante">Visitante</SelectItem>
              <SelectItem value="transferido">Transferido</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="joined_at">Data de Ingresso</Label>
          <Input
            id="joined_at"
            type="date"
            {...register('joined_at')}
          />
          {errors.joined_at && (
            <p className="text-sm text-red-600 mt-1">{errors.joined_at.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          {...register('address')}
          placeholder="Rua, número, bairro, cidade"
        />
        {errors.address && (
          <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : member ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;

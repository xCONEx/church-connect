
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Member } from '@/types';

interface MemberFormProps {
  member?: Member;
  churchId: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, churchId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: member?.name || '',
    cpf: member?.cpf || '',
    email: member?.email || '',
    phone: member?.phone || '',
    birth_date: member?.birth_date || '',
    address: member?.address || '',
    status: member?.status || 'ativo',
    joined_at: member?.joined_at || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      church_id: churchId,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{member ? 'Editar Membro' : 'Novo Membro'}</CardTitle>
        <CardDescription>
          {member ? 'Edite as informações do membro' : 'Adicione um novo membro à igreja'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="birth_date">Data de Nascimento *</Label>
              <Input
                id="birth_date"
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="joined_at">Data de Entrada</Label>
              <Input
                id="joined_at"
                name="joined_at"
                type="date"
                value={formData.joined_at}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="visitante">Visitante</option>
              <option value="transferido">Transferido</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button type="submit">
              {member ? 'Atualizar' : 'Criar'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MemberForm;

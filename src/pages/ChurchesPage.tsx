
import React, { useState } from 'react';
import { Plus, Church, Users, DollarSign, Edit, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useChurches } from '@/hooks/useSupabaseData';
import { useAuthContext } from '@/components/AuthProvider';
import { Church as ChurchType } from '@/types';

const ChurchesPage = () => {
  const { churches, loading, addChurch, updateChurch } = useChurches();
  const { user } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<ChurchType | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const totalChurches = churches.length;
  const totalMembers = churches.reduce((sum, church) => sum + (church.members_count || 0), 0);
  const totalFinance = churches.reduce((sum, church) => sum + (church.total_finance || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedChurch) {
        await updateChurch({
          id: selectedChurch.id,
          updates: formData
        });
      } else {
        await addChurch({
          ...formData,
          admin_id: user?.id || '',
          service_types: ['Culto Domingo Manhã', 'Culto Domingo Noite', 'Reunião de Oração']
        });
      }
      setIsFormOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar igreja:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
    setSelectedChurch(undefined);
  };

  const handleEdit = (church: ChurchType) => {
    setSelectedChurch(church);
    setFormData({
      name: church.name,
      email: church.email,
      phone: church.phone,
      address: church.address,
    });
    setIsFormOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <Layout userRole="master">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole="master">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Igrejas</h1>
          <Dialog open={isFormOpen} onOpenChange={(open) => {
            setIsFormOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Igreja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedChurch ? 'Editar Igreja' : 'Cadastrar Nova Igreja'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Igreja</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome da igreja"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(00) 0000-0000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="contato@igreja.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Endereço completo da igreja"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {selectedChurch ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Igrejas"
            value={totalChurches}
            icon={Church}
            color="blue"
          />
          <StatsCard
            title="Total de Membros"
            value={totalMembers}
            icon={Users}
            color="green"
          />
          <StatsCard
            title="Movimentação Total"
            value={formatCurrency(totalFinance)}
            icon={DollarSign}
            color="purple"
          />
        </div>

        {/* Tabela de Igrejas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Igrejas</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Membros</TableHead>
                <TableHead>Movimentação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {churches.map((church) => (
                <TableRow key={church.id}>
                  <TableCell className="font-medium">{church.name}</TableCell>
                  <TableCell>{church.email}</TableCell>
                  <TableCell>{church.phone}</TableCell>
                  <TableCell>{church.members_count || 0}</TableCell>
                  <TableCell>{formatCurrency(church.total_finance || 0)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Ver detalhes:', church.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(church)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default ChurchesPage;

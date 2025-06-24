
import React, { useState } from 'react';
import { Plus, Church, Users, DollarSign, Edit, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Church as ChurchType } from '@/types';

const ChurchesPage = () => {
  const [churches, setChurches] = useState<ChurchType[]>([
    {
      id: '1',
      name: 'Igreja Batista Central',
      cnpj: '12.345.678/0001-90',
      email: 'contato@igrejabatistacentral.com',
      phone: '(11) 3333-4444',
      address: 'Rua Principal, 100 - São Paulo/SP',
      created_at: '2023-01-15T10:00:00Z',
      members_count: 150,
      total_finance: 25000,
    },
    {
      id: '2',
      name: 'Igreja Presbiteriana Renovada',
      cnpj: '98.765.432/0001-12',
      email: 'contato@iprenovada.com',
      phone: '(11) 5555-6666',
      address: 'Av. da Paz, 500 - São Paulo/SP',
      created_at: '2023-03-20T10:00:00Z',
      members_count: 89,
      total_finance: 18000,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState<ChurchType | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
  });

  const totalChurches = churches.length;
  const totalMembers = churches.reduce((sum, church) => sum + (church.members_count || 0), 0);
  const totalFinance = churches.reduce((sum, church) => sum + (church.total_finance || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChurch) {
      setChurches(prev => prev.map(c => c.id === selectedChurch.id ? { ...c, ...formData } : c));
    } else {
      const newChurch: ChurchType = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
        members_count: 0,
        total_finance: 0,
      };
      setChurches(prev => [...prev, newChurch]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cnpj: '',
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
      cnpj: church.cnpj || '',
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                      placeholder="00.000.000/0000-00"
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

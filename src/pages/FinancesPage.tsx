
import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Finance } from '@/types';

const FinancesPage = () => {
  const [finances, setFinances] = useState<Finance[]>([
    {
      id: '1',
      church_id: '1',
      type: 'entrada',
      category: 'Dízimo',
      description: 'Dízimos do mês de Janeiro',
      amount: 5000,
      date: '2024-01-15',
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      church_id: '1',
      type: 'entrada',
      category: 'Oferta',
      description: 'Ofertas do culto dominical',
      amount: 1200,
      date: '2024-01-14',
      created_at: '2024-01-14T10:00:00Z',
    },
    {
      id: '3',
      church_id: '1',
      type: 'saida',
      category: 'Despesa',
      description: 'Conta de luz',
      amount: 450,
      date: '2024-01-10',
      created_at: '2024-01-10T10:00:00Z',
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'entrada' as 'entrada' | 'saida',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });

  const totalEntradas = finances.filter(f => f.type === 'entrada').reduce((sum, f) => sum + f.amount, 0);
  const totalSaidas = finances.filter(f => f.type === 'saida').reduce((sum, f) => sum + f.amount, 0);
  const saldo = totalEntradas - totalSaidas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFinance: Finance = {
      id: Date.now().toString(),
      church_id: '1',
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      created_at: new Date().toISOString(),
    };
    setFinances(prev => [...prev, newFinance]);
    setIsFormOpen(false);
    setFormData({
      type: 'entrada',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Layout userRole="church_admin" churchName="Igreja Exemplo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão Financeira</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Transação Financeira</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">Entrada</SelectItem>
                      <SelectItem value="saida">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.type === 'entrada' ? (
                        <>
                          <SelectItem value="Dízimo">Dízimo</SelectItem>
                          <SelectItem value="Oferta">Oferta</SelectItem>
                          <SelectItem value="Doação">Doação</SelectItem>
                          <SelectItem value="Evento">Evento</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Despesa">Despesa</SelectItem>
                          <SelectItem value="Manutenção">Manutenção</SelectItem>
                          <SelectItem value="Salário">Salário</SelectItem>
                          <SelectItem value="Material">Material</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição da transação"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0,00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Entradas"
            value={formatCurrency(totalEntradas)}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Total de Saídas"
            value={formatCurrency(totalSaidas)}
            icon={TrendingDown}
            color="orange"
          />
          <StatsCard
            title="Saldo Atual"
            value={formatCurrency(saldo)}
            icon={DollarSign}
            color={saldo >= 0 ? "green" : "purple"}
          />
        </div>

        {/* Tabela de Transações */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Últimas Transações</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finances.map((finance) => (
                <TableRow key={finance.id}>
                  <TableCell>{new Date(finance.date).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      finance.type === 'entrada' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {finance.type === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </TableCell>
                  <TableCell>{finance.category}</TableCell>
                  <TableCell>{finance.description}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    finance.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {finance.type === 'entrada' ? '+' : '-'}{formatCurrency(finance.amount)}
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

export default FinancesPage;

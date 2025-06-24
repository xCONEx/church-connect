
import React, { useState } from 'react';
import { Plus, Users } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Group } from '@/types';

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      church_id: '1',
      name: 'Ministério de Louvor',
      description: 'Grupo responsável pelo louvor nos cultos',
      members_count: 12,
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      church_id: '1',
      name: 'Jovens',
      description: 'Grupo dos jovens da igreja',
      members_count: 25,
      created_at: '2024-01-01T10:00:00Z',
    },
    {
      id: '3',
      church_id: '1',
      name: 'Mulheres em Oração',
      description: 'Ministério das mulheres',
      members_count: 18,
      created_at: '2024-01-01T10:00:00Z',
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGroup: Group = {
      id: Date.now().toString(),
      church_id: '1',
      ...formData,
      members_count: 0,
      created_at: new Date().toISOString(),
    };
    setGroups(prev => [...prev, newGroup]);
    setIsFormOpen(false);
    setFormData({
      name: '',
      description: '',
    });
  };

  const totalMembers = groups.reduce((sum, group) => sum + (group.members_count || 0), 0);

  return (
    <Layout userRole="church_admin" churchName="Igreja Exemplo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Grupos</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Grupo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Grupo</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Grupo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome do grupo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do grupo"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Grupo</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Total de Grupos"
            value={groups.length}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Total de Membros em Grupos"
            value={totalMembers}
            icon={Users}
            color="green"
          />
        </div>

        {/* Lista de Grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.members_count || 0} membros</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{group.description}</p>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Membros
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Adicionar mensagem quando não há grupos */}
        {groups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo cadastrado</h3>
            <p className="text-gray-500 mb-4">Comece criando seu primeiro grupo</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Grupo
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default GroupsPage;

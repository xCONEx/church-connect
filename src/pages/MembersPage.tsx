
import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MemberForm from '@/components/MemberForm';
import { useMembers } from '@/hooks/useSupabaseData';
import { Member } from '@/types';

const MembersPage = () => {
  const { members, loading, addMember, updateMember, deleteMember } = useMembers('1'); // Usando church_id fixo por enquanto
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (data: any) => {
    try {
      if (selectedMember) {
        await updateMember({
          id: selectedMember.id,
          updates: data
        });
      } else {
        await addMember(data);
      }
      setIsFormOpen(false);
      setSelectedMember(undefined);
    } catch (error) {
      console.error('Erro ao salvar membro:', error);
    }
  };

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleView = (member: Member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este membro?')) {
      try {
        await deleteMember(id);
      } catch (error) {
        console.error('Erro ao excluir membro:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ativo: 'bg-green-100 text-green-800',
      inativo: 'bg-gray-100 text-gray-800',
      visitante: 'bg-blue-100 text-blue-800',
      transferido: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || colors.ativo;
  };

  if (loading) {
    return (
      <Layout userRole="church_admin" churchName="Igreja Exemplo">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole="church_admin" churchName="Igreja Exemplo">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Membros</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedMember(undefined)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedMember ? 'Editar Membro' : 'Cadastrar Novo Membro'}
                </DialogTitle>
              </DialogHeader>
              <MemberForm
                member={selectedMember}
                churchId="1"
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedMember(undefined);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="visitante">Visitante</SelectItem>
                  <SelectItem value="transferido">Transferido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Tabela de Membros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Ingresso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(member.status)}`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(member.joined_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(member)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal de Visualização */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Membro</DialogTitle>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nome:</Label>
                    <p>{selectedMember.name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">CPF:</Label>
                    <p>{selectedMember.cpf}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Email:</Label>
                    <p>{selectedMember.email}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Telefone:</Label>
                    <p>{selectedMember.phone}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Data de Nascimento:</Label>
                    <p>{new Date(selectedMember.birth_date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Status:</Label>
                    <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedMember.status)}`}>
                      {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Endereço:</Label>
                  <p>{selectedMember.address}</p>
                </div>
                <div>
                  <Label className="font-semibold">Data de Ingresso:</Label>
                  <p>{new Date(selectedMember.joined_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MembersPage;

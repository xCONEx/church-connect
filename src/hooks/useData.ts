
import { useState, useEffect } from 'react';
import { Member, Group, Event, Finance, Church } from '@/types';

// Hook para simular dados - será substituído pela integração com Supabase
export const useMembers = (churchId: string) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setMembers([
        {
          id: '1',
          church_id: churchId,
          name: 'João Silva',
          cpf: '12345678901',
          email: 'joao@email.com',
          phone: '(11) 99999-9999',
          birth_date: '1980-05-15',
          address: 'Rua das Flores, 123 - São Paulo/SP',
          status: 'ativo',
          joined_at: '2022-01-15',
          created_at: '2022-01-15T10:00:00Z',
        },
        // Mais dados de exemplo...
      ]);
      setLoading(false);
    }, 1000);
  }, [churchId]);

  const addMember = (member: Omit<Member, 'id' | 'created_at'>) => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return {
    members,
    loading,
    addMember,
    updateMember,
    deleteMember,
  };
};

export const useChurches = () => {
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setChurches([
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
        // Mais dados de exemplo...
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const addChurch = (church: Omit<Church, 'id' | 'created_at'>) => {
    const newChurch: Church = {
      ...church,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setChurches(prev => [...prev, newChurch]);
    return newChurch;
  };

  const updateChurch = (id: string, updates: Partial<Church>) => {
    setChurches(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteChurch = (id: string) => {
    setChurches(prev => prev.filter(c => c.id !== id));
  };

  return {
    churches,
    loading,
    addChurch,
    updateChurch,
    deleteChurch,
  };
};

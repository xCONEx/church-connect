
import React from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import { Users, Calendar, DollarSign, UserPlus, CalendarPlus, TrendingUp } from 'lucide-react';

const ChurchDashboard = () => {
  // Mock data for Igreja Batista Central
  const churchData = {
    name: 'Igreja Batista Central',
    members: 450,
    activeMembers: 380,
    visitors: 25,
    monthlyIncome: 18500,
    monthlyExpenses: 12200,
    upcomingEvents: 5,
    totalGroups: 12
  };

  const recentMembers = [
    { id: 1, name: 'João Silva', joinDate: '2024-06-20', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', joinDate: '2024-06-18', status: 'Visitante' },
    { id: 3, name: 'Pedro Costa', joinDate: '2024-06-15', status: 'Ativo' },
    { id: 4, name: 'Ana Oliveira', joinDate: '2024-06-12', status: 'Ativo' }
  ];

  const upcomingEvents = [
    { id: 1, name: 'Culto de Domingo', date: '2024-06-30', time: '10:00' },
    { id: 2, name: 'Reunião de Jovens', date: '2024-07-02', time: '19:30' },
    { id: 3, name: 'Estudo Bíblico', date: '2024-07-03', time: '20:00' },
    { id: 4, name: 'Culto de Quarta', date: '2024-07-03', time: '19:30' }
  ];

  return (
    <Layout userRole="church_admin" churchName={churchData.name}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard da Igreja</h2>
          <p className="text-gray-600 mt-2">
            Visão geral da {churchData.name}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Membros"
            value={churchData.members}
            icon={Users}
            trend={{ value: '+12 este mês', isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Receita Mensal"
            value={`R$ ${churchData.monthlyIncome.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: '+8.5% vs mês anterior', isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Próximos Eventos"
            value={churchData.upcomingEvents}
            icon={Calendar}
            trend={{ value: '2 esta semana', isPositive: true }}
            color="purple"
          />
          <StatsCard
            title="Grupos Ativos"
            value={churchData.totalGroups}
            icon={Users}
            trend={{ value: '+1 novo grupo', isPositive: true }}
            color="orange"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Members */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Membros Recentes</h3>
                  <p className="text-sm text-gray-600">Últimos cadastros realizados</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Novo Membro
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Data de Cadastro</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMembers.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{member.name}</td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(member.joinDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            member.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Próximos Eventos</h3>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <CalendarPlus className="w-4 h-4 mr-1" />
                  Novo
                </button>
              </div>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 4).map((event) => (
                  <div key={event.id} className="flex justify-between items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{event.name}</h4>
                      <p className="text-xs text-gray-600">
                        {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Receitas do Mês</span>
                  <span className="text-sm font-medium text-green-600">
                    R$ {churchData.monthlyIncome.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Despesas do Mês</span>
                  <span className="text-sm font-medium text-red-600">
                    R$ {churchData.monthlyExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Saldo Atual</span>
                    <span className="text-sm font-bold text-blue-600">
                      R$ {(churchData.monthlyIncome - churchData.monthlyExpenses).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Membros Ativos</span>
                  <span className="text-sm font-medium text-gray-900">{churchData.activeMembers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Visitantes</span>
                  <span className="text-sm font-medium text-gray-900">{churchData.visitors}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Taxa de Crescimento</span>
                  <span className="text-sm font-medium text-green-600">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChurchDashboard;

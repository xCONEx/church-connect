
import React from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import { Church, Users, Calendar, DollarSign, TrendingUp, Eye } from 'lucide-react';

const MasterDashboard = () => {
  // Mock data
  const churches = [
    {
      id: 1,
      name: 'Igreja Batista Central',
      members: 450,
      totalFinances: 25000,
      events: 12,
      location: 'São Paulo, SP'
    },
    {
      id: 2,
      name: 'Igreja Presbiteriana da Paz',
      members: 320,
      totalFinances: 18500,
      events: 8,
      location: 'Rio de Janeiro, RJ'
    },
    {
      id: 3,
      name: 'Igreja Metodista Esperança',
      members: 280,
      totalFinances: 15200,
      events: 6,
      location: 'Belo Horizonte, MG'
    },
    {
      id: 4,
      name: 'Igreja Assembleia de Deus',
      members: 600,
      totalFinances: 32000,
      events: 15,
      location: 'Salvador, BA'
    }
  ];

  const totalMembers = churches.reduce((sum, church) => sum + church.members, 0);
  const totalFinances = churches.reduce((sum, church) => sum + church.totalFinances, 0);
  const totalEvents = churches.reduce((sum, church) => sum + church.events, 0);

  return (
    <Layout userRole="master">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard Master</h2>
          <p className="text-gray-600 mt-2">
            Visão geral de todas as igrejas cadastradas na plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Igrejas Cadastradas"
            value={churches.length}
            icon={Church}
            trend={{ value: '+2 este mês', isPositive: true }}
            color="blue"
          />
          <StatsCard
            title="Total de Membros"
            value={totalMembers.toLocaleString()}
            icon={Users}
            trend={{ value: '+124 este mês', isPositive: true }}
            color="green"
          />
          <StatsCard
            title="Eventos Cadastrados"
            value={totalEvents}
            icon={Calendar}
            trend={{ value: '+8 esta semana', isPositive: true }}
            color="purple"
          />
          <StatsCard
            title="Movimentação Financeira"
            value={`R$ ${totalFinances.toLocaleString()}`}
            icon={DollarSign}
            trend={{ value: '+12.5% este mês', isPositive: true }}
            color="orange"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Igrejas Cadastradas</h3>
              <p className="text-sm text-gray-600">Visão geral de todas as igrejas</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Igreja</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Membros</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Finanças</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Eventos</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {churches.map((church) => (
                      <tr key={church.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{church.name}</div>
                            <div className="text-sm text-gray-500">{church.location}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-900">{church.members}</td>
                        <td className="py-4 px-4 text-gray-900">
                          R$ {church.totalFinances.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-gray-900">{church.events}</td>
                        <td className="py-4 px-4">
                          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            Visualizar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Growth Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Novos membros</span>
                  <span className="text-sm font-medium text-green-600">+15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Receita total</span>
                  <span className="text-sm font-medium text-green-600">+12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Eventos</span>
                  <span className="text-sm font-medium text-green-600">+8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Igrejas ativas</span>
                  <span className="text-sm font-medium text-green-600">+25%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Church className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="font-medium">Adicionar Igreja</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-3" />
                    <span className="font-medium">Ver Relatórios</span>
                  </div>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="font-medium">Gerenciar Admins</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MasterDashboard;


import React from 'react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Church } from 'lucide-react';

const AnalyticsPage = () => {
  // Dados mockados para os gráficos
  const monthlyData = [
    { month: 'Jan', members: 320, finance: 45000 },
    { month: 'Fev', members: 335, finance: 48000 },
    { month: 'Mar', members: 342, finance: 52000 },
    { month: 'Abr', members: 358, finance: 49000 },
    { month: 'Mai', members: 371, finance: 55000 },
    { month: 'Jun', members: 389, finance: 58000 },
  ];

  const churchesData = [
    { name: 'Igreja Batista Central', members: 150, finance: 25000 },
    { name: 'Igreja Presbiteriana', members: 89, finance: 18000 },
    { name: 'Igreja Metodista', members: 120, finance: 22000 },
    { name: 'Igreja Assembleia', members: 200, finance: 35000 },
  ];

  const financeTypeData = [
    { name: 'Dízimos', value: 60, amount: 45000 },
    { name: 'Ofertas', value: 25, amount: 18750 },
    { name: 'Doações', value: 10, amount: 7500 },
    { name: 'Eventos', value: 5, amount: 3750 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Layout userRole="master">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios e Analytics</h1>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Igrejas"
            value="12"
            icon={Church}
            color="blue"
            trend={{ value: "2 este mês", isPositive: true }}
          />
          <StatsCard
            title="Total de Membros"
            value="2,389"
            icon={Users}
            color="green"
            trend={{ value: "8.2%", isPositive: true }}
          />
          <StatsCard
            title="Receita Total"
            value="R$ 125.400"
            icon={DollarSign}
            color="purple"
            trend={{ value: "12.5%", isPositive: true }}
          />
          <StatsCard
            title="Crescimento Médio"
            value="5.7%"
            icon={TrendingUp}
            color="orange"
            trend={{ value: "2.1%", isPositive: true }}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Crescimento Mensal */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crescimento de Membros</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Receita Mensal */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                <Bar dataKey="finance" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Pizza - Tipos de Receita */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Receitas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={financeTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {financeTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Ranking de Igrejas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance por Igreja</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={churchesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="members" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabela Resumo */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Resumo por Igreja</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Igreja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receita Mensal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crescimento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {churchesData.map((church, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {church.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {church.members}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R$ {church.finance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      +{Math.floor(Math.random() * 10) + 1}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;

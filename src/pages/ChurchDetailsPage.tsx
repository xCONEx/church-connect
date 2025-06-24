
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Church, Users, DollarSign, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useChurches } from '@/hooks/useSupabaseData';

const ChurchDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { churches, loading } = useChurches();

  const church = churches.find(c => c.id === id);

  if (loading) {
    return (
      <Layout userRole="master">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </Layout>
    );
  }

  if (!church) {
    return (
      <Layout userRole="master">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Igreja não encontrada</h2>
          <Button onClick={() => navigate('/master/churches')}>
            Voltar para lista de igrejas
          </Button>
        </div>
      </Layout>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Layout userRole="master">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/master/churches')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{church.name}</h1>
              <p className="text-gray-600">Detalhes da igreja</p>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total de Membros"
            value={church.members_count || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Movimentação Financeira"
            value={formatCurrency(church.total_finance || 0)}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Status"
            value="Ativa"
            icon={Church}
            color="purple"
          />
        </div>

        {/* Informações da Igreja */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Church className="w-5 h-5 mr-2" />
                Informações da Igreja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{church.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Telefone</p>
                  <p className="font-medium">{church.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Endereço</p>
                  <p className="font-medium">{church.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Tipos de Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {church.service_types && church.service_types.length > 0 ? (
                  church.service_types.map((service, index) => (
                    <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">{service}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Nenhum tipo de serviço cadastrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Gerencie e monitore esta igreja
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Ver Membros
              </Button>
              <Button variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                Ver Finanças
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Eventos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ChurchDetailsPage;

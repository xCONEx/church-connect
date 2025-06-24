
import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEvents } from '@/hooks/useSupabaseData';
import { useAuthContext } from '@/components/AuthProvider';

const EventsPage = () => {
  const { events, loading, addEvent } = useEvents('1'); // Usando church_id fixo por enquanto
  const { user } = useAuthContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0] + 'T10:00',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        church_id: '1',
        created_by: user?.id || '',
        is_public: true,
        status: 'published' as any,
        max_attendees: null,
        registration_deadline: null,
        image: null,
        tags: [],
        qr_readers: []
      });
      setIsFormOpen(false);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0] + 'T10:00',
        location: '',
      });
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const sortedEvents = events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingEvents = sortedEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = sortedEvents.filter(event => new Date(event.date) < new Date());

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
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Eventos</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Evento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Nome do Evento</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Nome do evento"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descrição do evento"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data e Horário</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="location">Local</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Local do evento"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Evento</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Próximos Eventos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Próximos Eventos</h2>
          </div>
          <div className="p-6">
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum evento próximo cadastrado</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800">
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Eventos Passados */}
        {pastEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Eventos Passados</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 opacity-75">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{event.title}</h3>
                        <p className="text-gray-500 mb-3">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventsPage;

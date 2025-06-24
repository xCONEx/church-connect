import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Member, Group, Event, Finance, Church, Profile } from '@/types';

// Hook para autenticação
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        // Se não encontrar o perfil, criar um básico
        await createProfile(userId);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();
      if (!authUser.user) return;

      const profileData = {
        id: userId,
        email: authUser.user.email || '',
        name: authUser.user.user_metadata?.full_name || 
              authUser.user.user_metadata?.name || 
              authUser.user.email?.split('@')[0] || 'Usuário',
        avatar: authUser.user.user_metadata?.avatar_url || 
               authUser.user.user_metadata?.picture || null,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (!error && data) {
        setProfile(data);
        
        // Criar role padrão
        const role = authUser.user.email === 'yuriadrskt@gmail.com' ? 'master' : 'member';
        await supabase
          .from('user_roles')
          .insert([{
            user_id: userId,
            church_id: null,
            role: role
          }]);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          full_name: name,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
    }
    return { error };
  };

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };
};

// Hook para verificar se o usuário tem uma church_id válida
const getCurrentChurchId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Para master users, retornar null
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role, church_id')
    .eq('user_id', user.id);

  const masterRole = roles?.find(r => r.role === 'master');
  if (masterRole) return null;

  // Para outros usuários, encontrar a primeira igreja válida
  const churchRole = roles?.find(r => r.church_id);
  return churchRole?.church_id || '1'; // Fallback para '1' por enquanto
};

// Hook para membros
export const useMembers = (churchId?: string) => {
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', churchId],
    queryFn: async () => {
      const actualChurchId = churchId || await getCurrentChurchId();
      if (!actualChurchId) return [];

      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('church_id', actualChurchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        return [];
      }
      return data as Member[];
    },
    enabled: !!churchId,
  });

  const addMember = useMutation({
    mutationFn: async (member: Omit<Member, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const updateMember = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Member> }) => {
      const { data, error } = await supabase
        .from('members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });

  return {
    members,
    loading: isLoading,
    addMember: addMember.mutateAsync,
    updateMember: updateMember.mutateAsync,
    deleteMember: deleteMember.mutateAsync,
  };
};

// Hook para igrejas (apenas para usuários master)
export const useChurches = () => {
  const queryClient = useQueryClient();

  const { data: churches = [], isLoading } = useQuery({
    queryKey: ['churches'],
    queryFn: async () => {
      // Primeiro tentar a view com estatísticas
      const { data: statsData, error: statsError } = await supabase
        .from('church_finance_stats')
        .select('*')
        .order('church_name');

      if (!statsError && statsData) {
        return statsData.map(church => ({
          id: church.church_id!,
          name: church.church_name!,
          members_count: church.members_count || 0,
          total_finance: church.balance || 0,
          created_at: '',
          admin_id: '',
          email: '',
          phone: '',
          address: '',
          service_types: [],
          updated_at: '',
        })) as Church[];
      }

      // Fallback para tabela churches diretamente
      const { data, error } = await supabase
        .from('churches')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching churches:', error);
        return [];
      }

      return (data || []).map(church => ({
        ...church,
        members_count: 0,
        total_finance: 0,
      })) as Church[];
    },
  });

  // ... keep existing code (addChurch, updateChurch, deleteChurch methods)
  const addChurch = useMutation({
    mutationFn: async (church: Omit<Church, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('churches')
        .insert([{
          name: church.name,
          admin_id: church.admin_id,
          email: church.email,
          phone: church.phone,
          address: church.address,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
    },
  });

  const updateChurch = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Church> }) => {
      const { data, error } = await supabase
        .from('churches')
        .update({
          name: updates.name,
          email: updates.email,
          phone: updates.phone,
          address: updates.address,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
    },
  });

  const deleteChurch = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('churches')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['churches'] });
    },
  });

  return {
    churches,
    loading: isLoading,
    addChurch: addChurch.mutateAsync,
    updateChurch: updateChurch.mutateAsync,
    deleteChurch: deleteChurch.mutateAsync,
  };
};

// Hook para grupos
export const useGroups = (churchId?: string) => {
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups', churchId],
    queryFn: async () => {
      const actualChurchId = churchId || await getCurrentChurchId();
      if (!actualChurchId) return [];

      // Primeiro tentar a view com contagem de membros
      const { data: groupData, error: groupError } = await supabase
        .from('group_member_counts')
        .select('*')
        .eq('church_id', actualChurchId)
        .order('created_at', { ascending: false });

      if (!groupError && groupData) {
        return groupData as Group[];
      }

      // Fallback para tabela groups diretamente
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('church_id', actualChurchId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching groups:', error);
        return [];
      }

      return (data || []).map(group => ({
        ...group,
        members_count: 0,
      })) as Group[];
    },
    enabled: !!churchId,
  });

  // ... keep existing code (addGroup, updateGroup, deleteGroup methods)
  const addGroup = useMutation({
    mutationFn: async (group: Omit<Group, 'id' | 'created_at' | 'updated_at' | 'members_count'>) => {
      const { data, error } = await supabase
        .from('groups')
        .insert([group])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const updateGroup = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Group> }) => {
      const { data, error } = await supabase
        .from('groups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const deleteGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  return {
    groups,
    loading: isLoading,
    addGroup: addGroup.mutateAsync,
    updateGroup: updateGroup.mutateAsync,
    deleteGroup: deleteGroup.mutateAsync,
  };
};

// Hook para finanças
export const useFinances = (churchId?: string) => {
  const queryClient = useQueryClient();

  const { data: finances = [], isLoading } = useQuery({
    queryKey: ['finances', churchId],
    queryFn: async () => {
      const actualChurchId = churchId || await getCurrentChurchId();
      if (!actualChurchId) return [];

      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('church_id', actualChurchId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching finances:', error);
        return [];
      }
      return data as Finance[];
    },
    enabled: !!churchId,
  });

  // ... keep existing code (addFinance, updateFinance, deleteFinance methods)
  const addFinance = useMutation({
    mutationFn: async (finance: Omit<Finance, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('finances')
        .insert([finance])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const updateFinance = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Finance> }) => {
      const { data, error } = await supabase
        .from('finances')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const deleteFinance = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('finances')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  return {
    finances,
    loading: isLoading,
    addFinance: addFinance.mutateAsync,
    updateFinance: updateFinance.mutateAsync,
    deleteFinance: deleteFinance.mutateAsync,
  };
};

// Hook para eventos
export const useEvents = (churchId?: string) => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', churchId],
    queryFn: async () => {
      const actualChurchId = churchId || await getCurrentChurchId();
      if (!actualChurchId) return [];

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('church_id', actualChurchId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }
      return data as Event[];
    },
    enabled: !!churchId,
  });

  // ... keep existing code (addEvent, updateEvent, deleteEvent methods)
  const addEvent = useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Event> }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events,
    loading: isLoading,
    addEvent: addEvent.mutateAsync,
    updateEvent: updateEvent.mutateAsync,
    deleteEvent: deleteEvent.mutateAsync,
  };
};

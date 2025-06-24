
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

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
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
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
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

// Hook para membros
export const useMembers = (churchId: string) => {
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      queryClient.invalidateQueries({ queryKey: ['members', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['members', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['members', churchId] });
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
      const { data, error } = await supabase
        .from('church_finance_stats')
        .select('*')
        .order('church_name');

      if (error) throw error;
      return data.map(church => ({
        id: church.church_id!,
        name: church.church_name!,
        members_count: church.members_count || 0,
        total_finance: church.balance || 0,
        // Campos adicionais serão preenchidos conforme necessário
        created_at: '',
        admin_id: '',
        email: '',
        phone: '',
        address: '',
        service_types: [],
        updated_at: '',
      })) as Church[];
    },
  });

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
export const useGroups = (churchId: string) => {
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['groups', churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_member_counts')
        .select('*')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Group[];
    },
    enabled: !!churchId,
  });

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
      queryClient.invalidateQueries({ queryKey: ['groups', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['groups', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['groups', churchId] });
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
export const useFinances = (churchId: string) => {
  const queryClient = useQueryClient();

  const { data: finances = [], isLoading } = useQuery({
    queryKey: ['finances', churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .eq('church_id', churchId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Finance[];
    },
    enabled: !!churchId,
  });

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
      queryClient.invalidateQueries({ queryKey: ['finances', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['finances', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['finances', churchId] });
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
export const useEvents = (churchId: string) => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('church_id', churchId)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Event[];
    },
    enabled: !!churchId,
  });

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
      queryClient.invalidateQueries({ queryKey: ['events', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['events', churchId] });
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
      queryClient.invalidateQueries({ queryKey: ['events', churchId] });
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


import { Tables } from '@/integrations/supabase/types'

export type Church = Tables<'churches'> & {
  members_count?: number;
  total_finance?: number;
}

export type Member = Tables<'members'>

export type Group = Tables<'groups'> & {
  members_count?: number;
}

export type Event = Tables<'events'>

export type Finance = Tables<'finances'>

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'admin' | 'leader' | 'collaborator' | 'member';
  church_id?: string;
}

export type Profile = Tables<'profiles'>

export type UserRole = Tables<'user_roles'>

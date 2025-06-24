
export interface Church {
  id: string;
  name: string;
  cnpj?: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  members_count?: number;
  total_finance?: number;
}

export interface Member {
  id: string;
  church_id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: string;
  address: string;
  status: 'ativo' | 'inativo' | 'visitante' | 'transferido';
  joined_at: string;
  created_at: string;
}

export interface Group {
  id: string;
  church_id: string;
  name: string;
  description: string;
  members_count?: number;
  created_at: string;
}

export interface Event {
  id: string;
  church_id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  created_at: string;
}

export interface Finance {
  id: string;
  church_id: string;
  type: 'entrada' | 'saida';
  category: string;
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'church_admin' | 'member';
  church_id?: string;
}

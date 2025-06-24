
-- Criar tabelas principais do sistema de gestão de igrejas

-- Tabela de membros
CREATE TABLE IF NOT EXISTS public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cpf TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date DATE NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'visitante', 'transferido')),
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de grupos
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabela de relacionamento entre membros e grupos
CREATE TABLE IF NOT EXISTS public.member_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(member_id, group_id)
);

-- Tabela de finanças
CREATE TABLE IF NOT EXISTS public.finances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para membros
CREATE POLICY "Users can view members of their church" ON public.members
  FOR SELECT USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid()
    ) OR public.is_master()
  );

CREATE POLICY "Users can insert members in their church" ON public.members
  FOR INSERT WITH CHECK (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

CREATE POLICY "Users can update members in their church" ON public.members
  FOR UPDATE USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

CREATE POLICY "Users can delete members in their church" ON public.members
  FOR DELETE USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

-- Políticas RLS para grupos
CREATE POLICY "Users can view groups of their church" ON public.groups
  FOR SELECT USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid()
    ) OR public.is_master()
  );

CREATE POLICY "Users can insert groups in their church" ON public.groups
  FOR INSERT WITH CHECK (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

CREATE POLICY "Users can update groups in their church" ON public.groups
  FOR UPDATE USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

CREATE POLICY "Users can delete groups in their church" ON public.groups
  FOR DELETE USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

-- Políticas RLS para member_groups
CREATE POLICY "Users can view member_groups of their church" ON public.member_groups
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM public.members 
      WHERE church_id IN (
        SELECT church_id FROM public.user_roles 
        WHERE user_id = auth.uid()
      )
    ) OR public.is_master()
  );

CREATE POLICY "Users can manage member_groups in their church" ON public.member_groups
  FOR ALL USING (
    member_id IN (
      SELECT id FROM public.members 
      WHERE church_id IN (
        SELECT church_id FROM public.user_roles 
        WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
      )
    ) OR public.is_master()
  );

-- Políticas RLS para finanças
CREATE POLICY "Users can view finances of their church" ON public.finances
  FOR SELECT USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid()
    ) OR public.is_master()
  );

CREATE POLICY "Users can insert finances in their church" ON public.finances
  FOR INSERT WITH CHECK (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

CREATE POLICY "Users can update finances in their church" ON public.finances
  FOR UPDATE USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

CREATE POLICY "Users can delete finances in their church" ON public.finances
  FOR DELETE USING (
    church_id IN (
      SELECT church_id FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'leader')
    ) OR public.is_master()
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER members_updated_at BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER groups_updated_at BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER finances_updated_at BEFORE UPDATE ON public.finances
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- View para contar membros por grupo
CREATE OR REPLACE VIEW public.group_member_counts AS
SELECT 
  g.id,
  g.church_id,
  g.name,
  g.description,
  g.created_at,
  g.updated_at,
  COALESCE(COUNT(mg.member_id), 0) as members_count
FROM public.groups g
LEFT JOIN public.member_groups mg ON g.id = mg.group_id
GROUP BY g.id, g.church_id, g.name, g.description, g.created_at, g.updated_at;

-- View para estatísticas financeiras por igreja
CREATE OR REPLACE VIEW public.church_finance_stats AS
SELECT 
  c.id as church_id,
  c.name as church_name,
  COALESCE(COUNT(m.id), 0) as members_count,
  COALESCE(SUM(CASE WHEN f.type = 'entrada' THEN f.amount ELSE 0 END), 0) as total_income,
  COALESCE(SUM(CASE WHEN f.type = 'saida' THEN f.amount ELSE 0 END), 0) as total_expenses,
  COALESCE(SUM(CASE WHEN f.type = 'entrada' THEN f.amount ELSE -f.amount END), 0) as balance
FROM public.churches c
LEFT JOIN public.members m ON c.id = m.church_id
LEFT JOIN public.finances f ON c.id = f.church_id
GROUP BY c.id, c.name;


// Este arquivo foi substituído por src/hooks/useSupabaseData.ts
// Mantido para compatibilidade temporária

export const useMembers = () => {
  console.warn('useMembers from useData.ts is deprecated. Use useSupabaseData.ts instead');
  return {
    members: [],
    loading: false,
    addMember: () => {},
    updateMember: () => {},
    deleteMember: () => {},
  };
};

export const useChurches = () => {
  console.warn('useChurches from useData.ts is deprecated. Use useSupabaseData.ts instead');
  return {
    churches: [],
    loading: false,
    addChurch: () => {},
    updateChurch: () => {},
    deleteChurch: () => {},
  };
};

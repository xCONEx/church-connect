
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LogOut, Church, Users, Calendar, DollarSign, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userRole?: 'master' | 'church_admin';
  churchName?: string;
}

const Layout = ({ children, userRole, churchName }: LayoutProps) => {
  const location = useLocation();

  const masterMenuItems = [
    { path: '/master', icon: Church, label: 'Dashboard', exact: true },
    { path: '/master/churches', icon: Church, label: 'Igrejas' },
    { path: '/master/analytics', icon: DollarSign, label: 'Relatórios' },
  ];

  const churchAdminMenuItems = [
    { path: '/admin', icon: Church, label: 'Dashboard', exact: true },
    { path: '/admin/members', icon: Users, label: 'Membros' },
    { path: '/admin/events', icon: Calendar, label: 'Eventos' },
    { path: '/admin/finances', icon: DollarSign, label: 'Finanças' },
    { path: '/admin/groups', icon: Users, label: 'Grupos' },
  ];

  const menuItems = userRole === 'master' ? masterMenuItems : churchAdminMenuItems;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-2">
            <Church className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">ChurchManager</h2>
              {churchName && (
                <p className="text-sm text-gray-600">{churchName}</p>
              )}
            </div>
          </Link>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-6 border-t border-gray-200">
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {userRole === 'master' ? 'Administração Master' : 'Administração da Igreja'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

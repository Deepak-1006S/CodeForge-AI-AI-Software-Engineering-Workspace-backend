import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Dropdown, { DropdownItem } from '../ui/Dropdown';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const dropdownItems: DropdownItem[] = [
    {
      label: 'Profile',
      icon: <User className="h-4 w-4" />,
      onClick: () => navigate('/profile'),
    },
    {
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      onClick: () => navigate('/settings'),
    },
    {
      separator: true,
      label: '',
    },
    {
      label: 'Logout',
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      }
      items={dropdownItems}
      align="right"
    />
  );
};

export default UserMenu;

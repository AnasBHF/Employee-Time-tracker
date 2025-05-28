import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../App';
import { HomeIcon, UsersIcon, ClockIcon, LogOutIcon } from 'lucide-react';
export function AdminNavigation() {
  const {
    user,
    logout
  } = useApp();
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  return <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                TimeTracker Admin
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              <HomeIcon className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
            <Link to="/employees" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/employees') ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
              <UsersIcon className="h-4 w-4 mr-1" />
              Employees
            </Link>
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <span className="text-sm text-gray-700">Hi, {user?.name}</span>
              <button onClick={logout} className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <LogOutIcon className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>;
}
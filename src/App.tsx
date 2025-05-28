import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { History } from './pages/History';
import { AdminDashboard } from './pages/AdminDashboard';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { Navigation } from './components/Navigation';
import { AdminNavigation } from './components/AdminNavigation';
interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
}
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  isActive: boolean;
  createdAt: string;
  password?: string;
}
interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number;
}
interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  employees: Employee[];
  timeEntries: TimeEntry[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  clockIn: () => void;
  clockOut: () => void;
  getCurrentEntry: () => TimeEntry | null;
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployeeTimeEntries: (employeeId: string) => TimeEntry[];
  getAllTimeEntries: () => TimeEntry[];
}
const AppContext = createContext<AppContextType | null>(null);
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
export function App() {
  // Initialize state from localStorage if available
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const savedEmployees = localStorage.getItem('employees');
    return savedEmployees ? JSON.parse(savedEmployees) : [];
  });
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const savedEntries = localStorage.getItem('timeEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);
  useEffect(() => {
    localStorage.setItem('timeEntries', JSON.stringify(timeEntries));
  }, [timeEntries]);
  const login = (email: string, password: string): boolean => {
    // Load initial data if employees array is empty
    if (employees.length === 0) {
      const mockEmployees: Employee[] = [{
        id: '1',
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Software Developer',
        isActive: true,
        createdAt: '2024-01-01',
        password: 'password123'
      }, {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        isActive: true,
        createdAt: '2024-01-02',
        password: 'password123'
      }, {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        department: 'Sales',
        position: 'Sales Representative',
        isActive: true,
        createdAt: '2024-01-03',
        password: 'password123'
      }];
      setEmployees(mockEmployees);
      localStorage.setItem('employees', JSON.stringify(mockEmployees));
    }
    // Admin authentication
    if (email === 'admin@company.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin',
        name: 'Admin User',
        email: 'admin@company.com',
        department: 'Administration',
        position: 'System Administrator'
      };
      setUser(adminUser);
      setIsAdmin(true);
      // Load all time entries for admin
      if (timeEntries.length === 0) {
        const today = new Date().toISOString().split('T')[0];
        const mockTimeEntries: TimeEntry[] = [
          {
            id: '1',
            employeeId: '1',
            date: today,
            clockIn: '08:45',
            clockOut: '17:30',
            totalHours: 8.75
          },
          {
            id: '2',
            employeeId: '2',
            date: today,
            clockIn: '09:15', // Late arrival
            clockOut: '17:45',
            totalHours: 8.5
          },
          {
            id: '3',
            employeeId: '3',
            date: today,
            clockIn: '08:30',
            clockOut: '16:30', // Early leave
            totalHours: 8.0
          },
          {
            id: '4',
            employeeId: '4',
            date: today,
            clockIn: '09:05', // Late arrival
            clockOut: '16:45', // Early leave
            totalHours: 7.67
          }
        ];
        setTimeEntries(mockTimeEntries);
        localStorage.setItem('timeEntries', JSON.stringify(mockTimeEntries));
      }
      return true;
    }
    // Legacy employee authentication
    if (email === 'employee@company.com' && password === 'password') {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email: 'employee@company.com',
        department: 'Engineering',
        position: 'Software Developer'
      };
      setUser(mockUser);
      setIsAdmin(false);
      return true;
    }
    // Check against created employees
    const employee = employees.find(emp => emp.email === email && emp.password === password && emp.isActive);
    if (employee) {
      const employeeUser: User = {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position
      };
      setUser(employeeUser);
      setIsAdmin(false);
      return true;
    }
    return false;
  };
  const logout = () => {
    setUser(null);
    setIsAdmin(false);
  };
  const getCurrentEntry = (): TimeEntry | null => {
    if (!user) return null;
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.find(entry => entry.date === today && entry.employeeId === user.id) || null;
  };
  const clockIn = () => {
    if (!user) return;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    const existingEntry = getCurrentEntry();
    if (existingEntry && !existingEntry.clockOut) return;
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      employeeId: user.id,
      date: today,
      clockIn: time,
      clockOut: null,
      totalHours: 0
    };
    setTimeEntries(prev => [...prev, newEntry]);
  };
  const clockOut = () => {
    if (!user) return;
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    setTimeEntries(prev => prev.map(entry => {
      if (entry.date === now.toISOString().split('T')[0] && entry.employeeId === user.id && entry.clockIn && !entry.clockOut) {
        const clockInTime = new Date(`${entry.date}T${entry.clockIn}:00`);
        const clockOutTime = new Date(`${entry.date}T${time}:00`);
        const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
        return {
          ...entry,
          clockOut: time,
          totalHours: Math.round(totalHours * 100) / 100
        };
      }
      return entry;
    }));
  };
  const addEmployee = (employeeData: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      password: employeeData.password || 'password123'
    };
    setEmployees(prev => [...prev, newEmployee]);
  };
  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? {
      ...emp,
      ...employeeData
    } : emp));
  };
  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setTimeEntries(prev => prev.filter(entry => entry.employeeId !== id));
  };
  const getEmployeeTimeEntries = (employeeId: string) => {
    return timeEntries.filter(entry => entry.employeeId === employeeId);
  };
  const getAllTimeEntries = () => {
    return timeEntries;
  };
  const contextValue: AppContextType = {
    user,
    isAdmin,
    employees,
    timeEntries,
    login,
    logout,
    clockIn,
    clockOut,
    getCurrentEntry,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeTimeEntries,
    getAllTimeEntries
  };
  return <AppContext.Provider value={contextValue}>
    <Router>
      <div className="min-h-screen bg-gray-50">
        {user ? <>
          {isAdmin ? <AdminNavigation /> : <Navigation />}
          <main className="pt-16">
            <Routes>
              {isAdmin ? <>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/employees" element={<EmployeeManagement />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </> : <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>}
            </Routes>
          </main>
        </> : <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>}
      </div>
    </Router>
  </AppContext.Provider>;
}
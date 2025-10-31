export interface Client {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  leaderId: string;
  developerIds: string[];
  tasks: string[];
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tasks: string[];
  createdBy: string;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  userId: string;
  clientId: string;
  projectId: string;
  task: string;
  date: Date;
  startTime: string;
  endTime: string;
  totalHours: number;
}

// Mock data
export const mockClients: Client[] = [
  { id: '1', name: 'TechCorp', description: 'Empresa de tecnología', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'FinanceApp', description: 'Aplicación financiera', createdAt: new Date('2024-02-01') },
  { id: '3', name: 'RetailPlus', description: 'Plataforma de retail', createdAt: new Date('2024-03-10') },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Sistema de Gestión',
    clientId: '1',
    leaderId: '2',
    developerIds: ['3', '4'],
    tasks: ['Análisis de requerimientos', 'Desarrollo de API', 'Interfaz de usuario', 'Testing'],
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    name: 'App Móvil',
    clientId: '2',
    leaderId: '2',
    developerIds: ['3'],
    tasks: ['Diseño UI/UX', 'Desarrollo Frontend', 'Integración API', 'Optimización'],
    createdAt: new Date('2024-02-05')
  },
];

export const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Desarrollo Web Estándar',
    description: 'Plantilla para proyectos web típicos',
    tasks: ['Análisis de requerimientos', 'Diseño de arquitectura', 'Desarrollo Frontend', 'Desarrollo Backend', 'Testing', 'Documentación'],
    createdBy: '1',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    name: 'App Móvil Básica',
    description: 'Plantilla para aplicaciones móviles',
    tasks: ['Prototipado', 'Diseño UI/UX', 'Desarrollo iOS', 'Desarrollo Android', 'Testing QA', 'Deploy'],
    createdBy: '1',
    createdAt: new Date('2024-01-15')
  },
];

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    userId: '3',
    clientId: '1',
    projectId: '1',
    task: 'Desarrollo de API',
    date: new Date('2024-10-07'),
    startTime: '09:00',
    endTime: '17:00',
    totalHours: 8
  },
  {
    id: '2',
    userId: '3',
    clientId: '1',
    projectId: '1',
    task: 'Testing',
    date: new Date('2024-10-08'),
    startTime: '09:00',
    endTime: '13:00',
    totalHours: 4
  },
  {
    id: '3',
    userId: '4',
    clientId: '2',
    projectId: '2',
    task: 'Desarrollo Frontend',
    date: new Date('2024-10-07'),
    startTime: '10:00',
    endTime: '19:00',
    totalHours: 9
  },
  {
    id: '4',
    userId: '4',
    clientId: '1',
    projectId: '1',
    task: 'Interfaz de usuario',
    date: new Date('2024-10-08'),
    startTime: '09:30',
    endTime: '15:30',
    totalHours: 6
  },
];

// Helper functions
export function getHourColor(hours: number): string {
  if (hours === 0) return 'bg-gray-200';
  if (hours >= 1 && hours <= 4) return 'bg-yellow-200';
  if (hours >= 5 && hours <= 8) return 'bg-green-200';
  if (hours >= 9) return 'bg-red-200';
  return 'bg-gray-200';
}

export function getClientName(clientId: string): string {
  return mockClients.find(c => c.id === clientId)?.name || 'Cliente desconocido';
}

export function getProjectName(projectId: string): string {
  return mockProjects.find(p => p.id === projectId)?.name || 'Proyecto desconocido';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'leader' | 'developer';
  createdAt: Date;
}

export const mockUsers: User[] = [
  { id: '1', name: 'Admin Usuario', email: 'admin@empresa.com', role: 'admin', createdAt: new Date('2024-01-01') },
  { id: '2', name: 'María Líder', email: 'maria@empresa.com', role: 'leader', createdAt: new Date('2024-01-05') },
  { id: '3', name: 'Carlos Desarrollador', email: 'carlos@empresa.com', role: 'developer', createdAt: new Date('2024-01-10') },
  { id: '4', name: 'Ana Desarrolladora', email: 'ana@empresa.com', role: 'developer', createdAt: new Date('2024-01-12') },
];

export function getUserName(userId: string): string {
  return mockUsers.find(u => u.id === userId)?.name || 'Usuario desconocido';
}
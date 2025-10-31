import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import {
  Users,
  Building,
  FolderOpen,
  FileText,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter
} from 'lucide-react';
import { 
  mockClients, 
  mockProjects, 
  mockTimeEntries, 
  mockTemplates,
  mockUsers,
  getClientName, 
  getProjectName, 
  getUserName,
  type Client,
  type Project,
  type Template,
  type User
} from './mockData';
import { toast } from 'sonner@2.0.3';

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  
  // Handle tab from URL hash
  const getTabFromHash = () => {
    const hash = location.hash.replace('#', '');
    return hash || 'clients';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromHash());
  
  useEffect(() => {
    setActiveTab(getTabFromHash());
  }, [location.hash]);
  
  // Client state
  const [newClient, setNewClient] = useState({ name: '', description: '' });
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  
  // Project state
  const [newProject, setNewProject] = useState({ name: '', clientId: '', leaderId: '' });
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  
  // User state
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'developer' as 'admin' | 'leader' | 'developer' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  
  // Template state
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', tasks: '' });
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  
  // Filter state for reports
  const [reportFilter, setReportFilter] = useState({ clientId: 'all', projectId: 'all', month: '' });

  const stats = [
    { title: 'Total Clientes', count: clients.length, icon: Building },
    { title: 'Total Proyectos', count: projects.length, icon: FolderOpen },
    { title: 'Total Usuarios', count: users.length, icon: Users },
    { title: 'Horas Totales', count: mockTimeEntries.reduce((sum, entry) => sum + entry.totalHours, 0), icon: BarChart3 },
  ];

  // CLIENT HANDLERS
  const handleCreateClient = () => {
    if (newClient.name) {
      const client: Client = {
        id: (clients.length + 1).toString(),
        name: newClient.name,
        description: newClient.description,
        createdAt: new Date()
      };
      setClients([...clients, client]);
      setNewClient({ name: '', description: '' });
      setIsClientDialogOpen(false);
      toast.success('Cliente creado exitosamente');
    }
  };

  const handleUpdateClient = () => {
    if (editingClient) {
      setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
      setEditingClient(null);
      setIsClientDialogOpen(false);
      toast.success('Cliente actualizado exitosamente');
    }
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast.success('Cliente eliminado');
  };

  const openEditClientDialog = (client: Client) => {
    setEditingClient(client);
    setIsClientDialogOpen(true);
  };

  const closeClientDialog = () => {
    setIsClientDialogOpen(false);
    setEditingClient(null);
    setNewClient({ name: '', description: '' });
  };

  // PROJECT HANDLERS
  const handleCreateProject = () => {
    if (newProject.name && newProject.clientId && newProject.leaderId) {
      const project: Project = {
        id: (projects.length + 1).toString(),
        name: newProject.name,
        clientId: newProject.clientId,
        leaderId: newProject.leaderId,
        developerIds: [],
        tasks: [],
        createdAt: new Date()
      };
      setProjects([...projects, project]);
      setNewProject({ name: '', clientId: '', leaderId: '' });
      setIsProjectDialogOpen(false);
      toast.success('Proyecto creado exitosamente');
    }
  };

  const handleUpdateProject = () => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      setEditingProject(null);
      setIsProjectDialogOpen(false);
      toast.success('Proyecto actualizado exitosamente');
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success('Proyecto eliminado');
  };

  const openEditProjectDialog = (project: Project) => {
    setEditingProject(project);
    setIsProjectDialogOpen(true);
  };

  const closeProjectDialog = () => {
    setIsProjectDialogOpen(false);
    setEditingProject(null);
    setNewProject({ name: '', clientId: '', leaderId: '' });
  };

  // USER HANDLERS
  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user: User = {
        id: (users.length + 1).toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date()
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'developer' });
      setIsUserDialogOpen(false);
      toast.success('Usuario creado exitosamente');
    }
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
      setIsUserDialogOpen(false);
      toast.success('Usuario actualizado exitosamente');
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast.success('Usuario eliminado');
  };

  const openEditUserDialog = (user: User) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const closeUserDialog = () => {
    setIsUserDialogOpen(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'developer' });
  };

  // TEMPLATE HANDLERS
  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.description && newTemplate.tasks) {
      const template: Template = {
        id: (templates.length + 1).toString(),
        name: newTemplate.name,
        description: newTemplate.description,
        tasks: newTemplate.tasks.split('\n').filter(t => t.trim()),
        createdBy: '1',
        createdAt: new Date()
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', description: '', tasks: '' });
      setIsTemplateDialogOpen(false);
      toast.success('Plantilla creada exitosamente');
    }
  };

  const handleUpdateTemplate = () => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? editingTemplate : t));
      setEditingTemplate(null);
      setIsTemplateDialogOpen(false);
      toast.success('Plantilla actualizada exitosamente');
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success('Plantilla eliminada');
  };

  const openEditTemplateDialog = (template: Template) => {
    setEditingTemplate({...template});
    setIsTemplateDialogOpen(true);
  };

  const closeTemplateDialog = () => {
    setIsTemplateDialogOpen(false);
    setEditingTemplate(null);
    setNewTemplate({ name: '', description: '', tasks: '' });
  };

  // EXPORT HANDLERS
  const exportData = async (format: 'excel' | 'json') => {
    const filteredEntries = mockTimeEntries.filter(entry => {
      if (reportFilter.clientId && reportFilter.clientId !== 'all' && entry.clientId !== reportFilter.clientId) return false;
      if (reportFilter.projectId && reportFilter.projectId !== 'all' && entry.projectId !== reportFilter.projectId) return false;
      if (reportFilter.month) {
        const entryMonth = entry.date.toISOString().substring(0, 7);
        if (entryMonth !== reportFilter.month) return false;
      }
      return true;
    });

    if (format === 'json') {
      const data = {
        clients,
        projects,
        users,
        timeEntries: filteredEntries.map(entry => ({
          ...entry,
          date: entry.date.toISOString().split('T')[0],
          clientName: getClientName(entry.clientId),
          projectName: getProjectName(entry.projectId),
          userName: getUserName(entry.userId)
        }))
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-datos-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Datos exportados en formato JSON');
    } else {
      try {
        const XLSX = await import('xlsx');
        
        const excelData = filteredEntries.map(entry => ({
          Fecha: entry.date.toLocaleDateString('es-ES'),
          Usuario: getUserName(entry.userId),
          Cliente: getClientName(entry.clientId),
          Proyecto: getProjectName(entry.projectId),
          Tarea: entry.task,
          Inicio: entry.startTime,
          Fin: entry.endTime,
          TotalHoras: entry.totalHoras
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
        XLSX.writeFile(workbook, `reporte-${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Datos exportados en formato Excel');
      } catch (error) {
        toast.error('Error al exportar a Excel');
        console.error(error);
      }
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch(role) {
      case 'admin': return 'destructive';
      case 'leader': return 'default';
      case 'developer': return 'secondary';
      default: return 'outline';
    }
  };

  // Filter time entries for reports
  const filteredTimeEntries = mockTimeEntries.filter(entry => {
    if (reportFilter.clientId && reportFilter.clientId !== 'all' && entry.clientId !== reportFilter.clientId) return false;
    if (reportFilter.projectId && reportFilter.projectId !== 'all' && entry.projectId !== reportFilter.projectId) return false;
    if (reportFilter.month) {
      const entryMonth = entry.date.toISOString().substring(0, 7);
      if (entryMonth !== reportFilter.month) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1>Panel Administrativo</h1>
          <p className="text-muted-foreground">Gestione clientes, proyectos, usuarios y plantillas del sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div>{stat.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          navigate(`/admin#${value}`, { replace: true });
        }} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="templates">Plantillas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Clientes</CardTitle>
                    <CardDescription>Administre los clientes del sistema</CardDescription>
                  </div>
                  <Dialog open={isClientDialogOpen} onOpenChange={setIsClientDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingClient(null); setNewClient({ name: '', description: '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Cliente
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}</DialogTitle>
                        <DialogDescription>
                          {editingClient ? 'Modifique los datos del cliente' : 'Ingrese los datos del nuevo cliente'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="clientName">Nombre</Label>
                          <Input
                            id="clientName"
                            value={editingClient ? editingClient.name : newClient.name}
                            onChange={(e) => editingClient 
                              ? setEditingClient({...editingClient, name: e.target.value})
                              : setNewClient({...newClient, name: e.target.value})
                            }
                            placeholder="Nombre del cliente"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientDescription">Descripción</Label>
                          <Input
                            id="clientDescription"
                            value={editingClient ? editingClient.description || '' : newClient.description}
                            onChange={(e) => editingClient
                              ? setEditingClient({...editingClient, description: e.target.value})
                              : setNewClient({...newClient, description: e.target.value})
                            }
                            placeholder="Descripción opcional"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={editingClient ? handleUpdateClient : handleCreateClient} 
                            className="flex-1"
                          >
                            {editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}
                          </Button>
                          {editingClient && (
                            <Button variant="outline" onClick={closeClientDialog}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>{client.name}</TableCell>
                        <TableCell>{client.description || '-'}</TableCell>
                        <TableCell>{client.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditClientDialog(client)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteClient(client.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Proyectos</CardTitle>
                    <CardDescription>Administre los proyectos y asigne líderes</CardDescription>
                  </div>
                  <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingProject(null); setNewProject({ name: '', clientId: '', leaderId: '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Proyecto
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
                        <DialogDescription>
                          {editingProject ? 'Modifique los datos del proyecto' : 'Ingrese los datos del nuevo proyecto'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="projectName">Nombre</Label>
                          <Input
                            id="projectName"
                            value={editingProject ? editingProject.name : newProject.name}
                            onChange={(e) => editingProject
                              ? setEditingProject({...editingProject, name: e.target.value})
                              : setNewProject({...newProject, name: e.target.value})
                            }
                            placeholder="Nombre del proyecto"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectClient">Cliente</Label>
                          <Select 
                            value={editingProject ? editingProject.clientId : newProject.clientId}
                            onValueChange={(value) => editingProject
                              ? setEditingProject({...editingProject, clientId: value})
                              : setNewProject({...newProject, clientId: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="projectLeader">Líder</Label>
                          <Select 
                            value={editingProject ? editingProject.leaderId : newProject.leaderId}
                            onValueChange={(value) => editingProject
                              ? setEditingProject({...editingProject, leaderId: value})
                              : setNewProject({...newProject, leaderId: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar líder" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.filter(u => u.role === 'leader').map((leader) => (
                                <SelectItem key={leader.id} value={leader.id}>
                                  {leader.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={editingProject ? handleUpdateProject : handleCreateProject} 
                            className="flex-1"
                          >
                            {editingProject ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                          </Button>
                          {editingProject && (
                            <Button variant="outline" onClick={closeProjectDialog}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Líder</TableHead>
                      <TableHead>Desarrolladores</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{getClientName(project.clientId)}</TableCell>
                        <TableCell>{getUserName(project.leaderId)}</TableCell>
                        <TableCell>{project.developerIds.length}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditProjectDialog(project)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Usuarios</CardTitle>
                    <CardDescription>Administre usuarios y roles del sistema</CardDescription>
                  </div>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingUser(null); setNewUser({ name: '', email: '', role: 'developer' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Usuario
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
                        <DialogDescription>
                          {editingUser ? 'Modifique los datos del usuario' : 'Ingrese los datos del nuevo usuario'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="userName">Nombre</Label>
                          <Input
                            id="userName"
                            value={editingUser ? editingUser.name : newUser.name}
                            onChange={(e) => editingUser
                              ? setEditingUser({...editingUser, name: e.target.value})
                              : setNewUser({...newUser, name: e.target.value})
                            }
                            placeholder="Nombre completo"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userEmail">Email</Label>
                          <Input
                            id="userEmail"
                            type="email"
                            value={editingUser ? editingUser.email : newUser.email}
                            onChange={(e) => editingUser
                              ? setEditingUser({...editingUser, email: e.target.value})
                              : setNewUser({...newUser, email: e.target.value})
                            }
                            placeholder="usuario@empresa.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="userRole">Rol</Label>
                          <Select 
                            value={editingUser ? editingUser.role : newUser.role}
                            onValueChange={(value: 'admin' | 'leader' | 'developer') => editingUser
                              ? setEditingUser({...editingUser, role: value})
                              : setNewUser({...newUser, role: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="leader">Líder</SelectItem>
                              <SelectItem value="developer">Desarrollador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={editingUser ? handleUpdateUser : handleCreateUser} 
                            className="flex-1"
                          >
                            {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                          </Button>
                          {editingUser && (
                            <Button variant="outline" onClick={closeUserDialog}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role === 'admin' ? 'Administrador' : user.role === 'leader' ? 'Líder' : 'Desarrollador'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditUserDialog(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Plantillas</CardTitle>
                    <CardDescription>Cree plantillas de tareas predeterminadas para proyectos</CardDescription>
                  </div>
                  <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => { setEditingTemplate(null); setNewTemplate({ name: '', description: '', tasks: '' }); }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Nueva Plantilla
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingTemplate ? 'Editar Plantilla' : 'Crear Nueva Plantilla'}</DialogTitle>
                        <DialogDescription>
                          {editingTemplate ? 'Modifique los datos de la plantilla' : 'Ingrese los datos de la nueva plantilla'}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="templateName">Nombre</Label>
                          <Input
                            id="templateName"
                            value={editingTemplate ? editingTemplate.name : newTemplate.name}
                            onChange={(e) => editingTemplate
                              ? setEditingTemplate({...editingTemplate, name: e.target.value})
                              : setNewTemplate({...newTemplate, name: e.target.value})
                            }
                            placeholder="Nombre de la plantilla"
                          />
                        </div>
                        <div>
                          <Label htmlFor="templateDescription">Descripción</Label>
                          <Input
                            id="templateDescription"
                            value={editingTemplate ? editingTemplate.description : newTemplate.description}
                            onChange={(e) => editingTemplate
                              ? setEditingTemplate({...editingTemplate, description: e.target.value})
                              : setNewTemplate({...newTemplate, description: e.target.value})
                            }
                            placeholder="Descripción de la plantilla"
                          />
                        </div>
                        <div>
                          <Label htmlFor="templateTasks">Tareas (una por línea)</Label>
                          <Textarea
                            id="templateTasks"
                            value={editingTemplate ? editingTemplate.tasks.join('\n') : newTemplate.tasks}
                            onChange={(e) => editingTemplate
                              ? setEditingTemplate({...editingTemplate, tasks: e.target.value.split('\n').filter(t => t.trim())})
                              : setNewTemplate({...newTemplate, tasks: e.target.value})
                            }
                            placeholder="Análisis de requerimientos&#10;Desarrollo Frontend&#10;Testing"
                            rows={6}
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate} 
                            className="flex-1"
                          >
                            {editingTemplate ? 'Actualizar Plantilla' : 'Crear Plantilla'}
                          </Button>
                          {editingTemplate && (
                            <Button variant="outline" onClick={closeTemplateDialog}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Tareas</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell>{template.name}</TableCell>
                        <TableCell>{template.description}</TableCell>
                        <TableCell>{template.tasks.length} tareas</TableCell>
                        <TableCell>{template.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditTemplateDialog(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Reportes Globales</CardTitle>
                    <CardDescription>Consulte y exporte todas las horas registradas</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => exportData('excel')}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button variant="outline" onClick={() => exportData('json')}>
                      <Download className="h-4 w-4 mr-2" />
                      JSON
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Filtros</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="filterClient">Cliente</Label>
                      <Select 
                        value={reportFilter.clientId}
                        onValueChange={(value) => setReportFilter({...reportFilter, clientId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los clientes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los clientes</SelectItem>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="filterProject">Proyecto</Label>
                      <Select 
                        value={reportFilter.projectId}
                        onValueChange={(value) => setReportFilter({...reportFilter, projectId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los proyectos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los proyectos</SelectItem>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="filterMonth">Mes</Label>
                      <Input
                        id="filterMonth"
                        type="month"
                        value={reportFilter.month}
                        onChange={(e) => setReportFilter({...reportFilter, month: e.target.value})}
                      />
                    </div>
                  </div>
                  {(reportFilter.clientId !== 'all' || reportFilter.projectId !== 'all' || reportFilter.month) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setReportFilter({ clientId: 'all', projectId: 'all', month: '' })}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Total Horas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>{filteredTimeEntries.reduce((sum, entry) => sum + entry.totalHours, 0)}h</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Total Entradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>{filteredTimeEntries.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Promedio Diario</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        {filteredTimeEntries.length > 0 
                          ? (filteredTimeEntries.reduce((sum, entry) => sum + entry.totalHours, 0) / filteredTimeEntries.length).toFixed(1)
                          : 0}h
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Tarea</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimeEntries.length > 0 ? (
                      filteredTimeEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{getUserName(entry.userId)}</TableCell>
                          <TableCell>{getClientName(entry.clientId)}</TableCell>
                          <TableCell>{getProjectName(entry.projectId)}</TableCell>
                          <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                          <TableCell>{entry.totalHours}h</TableCell>
                          <TableCell>{entry.task}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No hay registros que coincidan con los filtros seleccionados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

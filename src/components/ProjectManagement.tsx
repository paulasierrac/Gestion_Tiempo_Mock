import React, { useState } from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
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
import { Badge } from './ui/badge';
import { FolderOpen, Plus, Users, Edit, Trash2, FileText } from 'lucide-react';
import { mockClients, mockProjects, mockTemplates, getClientName } from './mockData';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner@2.0.3';

export default function ProjectManagement() {
  const { user } = useAuth();
  const [projects, setProjects] = useState(mockProjects.filter(p => p.leaderId === user?.id));
  const [newProject, setNewProject] = useState({
    name: '',
    clientId: '',
    templateId: 'none',
    developerIds: [] as string[]
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedProjectForTasks, setSelectedProjectForTasks] = useState<any>(null);
  const [newTaskName, setNewTaskName] = useState('');

  const developers = [
    { id: '3', name: 'Carlos Desarrollador' },
    { id: '4', name: 'Ana Desarrolladora' }
  ];

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.clientId) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    const template = newProject.templateId !== 'none' ? mockTemplates.find(t => t.id === newProject.templateId) : null;
    const project = {
      id: (projects.length + 1).toString(),
      name: newProject.name,
      clientId: newProject.clientId,
      leaderId: user!.id,
      developerIds: newProject.developerIds,
      tasks: template ? template.tasks : [],
      createdAt: new Date()
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', clientId: '', templateId: 'none', developerIds: [] });
    setIsCreateDialogOpen(false);
    toast.success('Proyecto creado exitosamente');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast.success('Proyecto eliminado');
  };

  const handleDeveloperToggle = (developerId: string, checked: boolean) => {
    if (checked) {
      setNewProject({
        ...newProject,
        developerIds: [...newProject.developerIds, developerId]
      });
    } else {
      setNewProject({
        ...newProject,
        developerIds: newProject.developerIds.filter(id => id !== developerId)
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templateId !== 'none' ? mockTemplates.find(t => t.id === templateId) : null;
    setSelectedTemplate(template);
    setNewProject({ ...newProject, templateId });
  };

  const getDeveloperNames = (developerIds: string[]) => {
    return developerIds
      .map(id => developers.find(d => d.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleOpenTaskDialog = (project: any) => {
    setSelectedProjectForTasks(project);
    setIsTaskDialogOpen(true);
  };

  const handleAddTask = () => {
    if (!newTaskName || !selectedProjectForTasks) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProjectForTasks.id) {
        return {
          ...p,
          tasks: [...p.tasks, newTaskName]
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    setNewTaskName('');
    toast.success('Tarea agregada exitosamente');
  };

  const handleRemoveTask = (taskIndex: number) => {
    if (!selectedProjectForTasks) return;
    
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProjectForTasks.id) {
        return {
          ...p,
          tasks: p.tasks.filter((_, index) => index !== taskIndex)
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    setSelectedProjectForTasks({
      ...selectedProjectForTasks,
      tasks: selectedProjectForTasks.tasks.filter((_: any, index: number) => index !== taskIndex)
    });
    toast.success('Tarea eliminada');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Administre sus proyectos y asigne desarrolladores</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desarrolladores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{developers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plantillas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTemplates.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Mis Proyectos</CardTitle>
                <CardDescription>Lista de proyectos bajo su liderazgo</CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                    <DialogDescription>
                      Complete la información del proyecto y asigne desarrolladores
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="projectName">Nombre del Proyecto *</Label>
                        <Input
                          id="projectName"
                          value={newProject.name}
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                          placeholder="Nombre del proyecto"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="client">Cliente *</Label>
                        <Select 
                          value={newProject.clientId}
                          onValueChange={(value) => setNewProject({...newProject, clientId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cliente" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Template Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="template">Plantilla (Opcional)</Label>
                      <Select 
                        value={newProject.templateId}
                        onValueChange={handleTemplateSelect}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar plantilla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin plantilla</SelectItem>
                          {mockTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedTemplate && (
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-sm font-medium">{selectedTemplate.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Tareas incluidas:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTemplate.tasks.map((task: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {task}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Developer Assignment */}
                    <div className="space-y-2">
                      <Label>Asignar Desarrolladores</Label>
                      <div className="space-y-2">
                        {developers.map((developer) => (
                          <div key={developer.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={developer.id}
                              checked={newProject.developerIds.includes(developer.id)}
                              onCheckedChange={(checked) => 
                                handleDeveloperToggle(developer.id, checked as boolean)
                              }
                            />
                            <Label htmlFor={developer.id}>{developer.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleCreateProject} className="w-full">
                      Crear Proyecto
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay proyectos creados aún</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Crear Primer Proyecto
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Desarrolladores</TableHead>
                    <TableHead>Tareas</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{getClientName(project.clientId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{project.developerIds.length}</span>
                        </div>
                        {project.developerIds.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {getDeveloperNames(project.developerIds)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {project.tasks.length} tareas
                        </Badge>
                      </TableCell>
                      <TableCell>{project.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenTaskDialog(project)}
                            title="Gestionar tareas"
                          >
                            <FileText className="h-4 w-4" />
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
            )}
          </CardContent>
        </Card>

        {/* Task Management Dialog */}
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Gestionar Tareas - {selectedProjectForTasks?.name}</DialogTitle>
              <DialogDescription>
                Agregue o elimine tareas del proyecto
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Add New Task */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Nueva tarea..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <Button onClick={handleAddTask} disabled={!newTaskName}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>

              {/* Task List */}
              <div className="space-y-2">
                <Label>Tareas actuales ({selectedProjectForTasks?.tasks.length || 0})</Label>
                {selectedProjectForTasks?.tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No hay tareas en este proyecto</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {selectedProjectForTasks?.tasks.map((task: string, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm">{task}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveTask(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
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
import { FileText, Plus, Edit, Trash2, X } from 'lucide-react';
import { mockTemplates } from './mockData';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner@2.0.3';

export default function TemplateManagement() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState(mockTemplates);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    tasks: ['']
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }

    const validTasks = newTemplate.tasks.filter(task => task.trim() !== '');
    if (validTasks.length === 0) {
      toast.error('Debe agregar al menos una tarea');
      return;
    }

    const template = {
      id: (templates.length + 1).toString(),
      name: newTemplate.name,
      description: newTemplate.description,
      tasks: validTasks,
      createdBy: user!.id,
      createdAt: new Date()
    };

    setTemplates([...templates, template]);
    setNewTemplate({ name: '', description: '', tasks: [''] });
    setIsCreateDialogOpen(false);
    toast.success('Plantilla creada exitosamente');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast.success('Plantilla eliminada');
  };

  const addTask = () => {
    setNewTemplate({
      ...newTemplate,
      tasks: [...newTemplate.tasks, '']
    });
  };

  const updateTask = (index: number, value: string) => {
    const updatedTasks = [...newTemplate.tasks];
    updatedTasks[index] = value;
    setNewTemplate({
      ...newTemplate,
      tasks: updatedTasks
    });
  };

  const removeTask = (index: number) => {
    if (newTemplate.tasks.length > 1) {
      setNewTemplate({
        ...newTemplate,
        tasks: newTemplate.tasks.filter((_, i) => i !== index)
      });
    }
  };

  const canEdit = (template: any) => {
    return user?.role === 'admin' || template.createdBy === user?.id;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Gestión de Plantillas</h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' ? 
              'Cree y administre plantillas de tareas para todos los proyectos' :
              'Aplique plantillas existentes y cree las suyas propias'
            }
          </p>
        </div>

        {/* Stats Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg">Total de Plantillas</CardTitle>
              <CardDescription>Plantillas disponibles en el sistema</CardDescription>
            </div>
            <FileText className="h-8 w-8 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>

        {/* Templates Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Plantillas de Tareas</CardTitle>
                <CardDescription>
                  Conjuntos predefinidos de tareas para agilizar la creación de proyectos
                </CardDescription>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Plantilla
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Crear Nueva Plantilla</DialogTitle>
                    <DialogDescription>
                      Defina una plantilla con tareas predeterminadas para proyectos similares
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="templateName">Nombre de la Plantilla *</Label>
                        <Input
                          id="templateName"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          placeholder="ej. Desarrollo Web Estándar"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="templateDescription">Descripción *</Label>
                        <Textarea
                          id="templateDescription"
                          value={newTemplate.description}
                          onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                          placeholder="Describe cuándo usar esta plantilla..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Tareas de la Plantilla</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addTask}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Tarea
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        {newTemplate.tasks.map((task, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="flex-1">
                              <Input
                                value={task}
                                onChange={(e) => updateTask(index, e.target.value)}
                                placeholder={`Tarea ${index + 1}`}
                              />
                            </div>
                            {newTemplate.tasks.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTask(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleCreateTemplate} className="w-full">
                      Crear Plantilla
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {templates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay plantillas creadas aún</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  Crear Primera Plantilla
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Tareas</TableHead>
                    <TableHead>Creador</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="truncate" title={template.description}>
                          {template.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {template.tasks.slice(0, 3).map((task, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {task}
                            </Badge>
                          ))}
                          {template.tasks.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.tasks.length - 3} más
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.tasks.length} tareas total
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.createdBy === '1' ? 'default' : 'secondary'}>
                          {template.createdBy === '1' ? 'Admin' : 'Líder'}
                        </Badge>
                      </TableCell>
                      <TableCell>{template.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {canEdit(template) && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Template Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  {template.name}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tareas incluidas:</p>
                  <div className="space-y-1">
                    {template.tasks.map((task, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
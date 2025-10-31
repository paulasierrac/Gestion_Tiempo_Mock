import React, { useState } from "react";
import Navigation from "./Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Clock, Plus, Save, RotateCcw } from "lucide-react";
import {
  mockClients,
  mockProjects,
  mockTimeEntries,
  getClientName,
  getProjectName,
} from "./mockData";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner@2.0.3";

interface TimeEntry {
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

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] =
    useState(mockTimeEntries);
  const [newEntry, setNewEntry] = useState({
    clientId: "",
    projectId: "",
    task: "",
    customTask: "",
    useCustomTask: false,
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
  });

  // Filter projects based on selected client where user is assigned
  const availableProjects = mockProjects.filter(
    (project) => 
      project.clientId === newEntry.clientId && 
      project.developerIds.includes(user?.id || '')
  );

  // Get tasks from selected project
  const selectedProject = mockProjects.find(p => p.id === newEntry.projectId);
  const availableTasks = selectedProject?.tasks || [];

  // Get user's time entries
  const userEntries = timeEntries.filter(
    (entry) => entry.userId === user?.id,
  );

  const calculateHours = (
    start: string,
    end: string,
  ): number => {
    if (!start || !end) return 0;

    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);

    if (endTime <= startTime) return 0;

    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const getTotalDailyHours = (date: string): number => {
    return userEntries
      .filter(
        (entry) =>
          entry.date.toISOString().split("T")[0] === date,
      )
      .reduce((sum, entry) => sum + entry.totalHours, 0);
  };

  const validateEntry = (): boolean => {
    const taskToUse = newEntry.useCustomTask ? newEntry.customTask : newEntry.task;
    
    if (
      !newEntry.clientId ||
      !newEntry.projectId ||
      !taskToUse ||
      !newEntry.startTime ||
      !newEntry.endTime
    ) {
      toast.error("Por favor complete todos los campos");
      return false;
    }

    const hours = calculateHours(
      newEntry.startTime,
      newEntry.endTime,
    );
    if (hours <= 0) {
      toast.error(
        "La hora de fin debe ser mayor que la hora de inicio",
      );
      return false;
    }

    const dailyHours =
      getTotalDailyHours(newEntry.date) + hours;
    if (dailyHours > 9) {
      toast.error("No puede exceder 9 horas diarias");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEntry()) return;

    const totalHours = calculateHours(
      newEntry.startTime,
      newEntry.endTime,
    );

    const taskToUse = newEntry.useCustomTask ? newEntry.customTask : newEntry.task;

    const entry: TimeEntry = {
      id: (timeEntries.length + 1).toString(),
      userId: user!.id,
      clientId: newEntry.clientId,
      projectId: newEntry.projectId,
      task: taskToUse,
      date: new Date(newEntry.date),
      startTime: newEntry.startTime,
      endTime: newEntry.endTime,
      totalHours,
    };

    setTimeEntries([...timeEntries, entry]);
    toast.success("Registro de horas guardado exitosamente");
    handleClear();
  };

  const handleClear = () => {
    setNewEntry({
      clientId: "",
      projectId: "",
      task: "",
      customTask: "",
      useCustomTask: false,
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      endTime: "",
    });
  };

  const currentHours = calculateHours(
    newEntry.startTime,
    newEntry.endTime,
  );
  const dailyTotal = getTotalDailyHours(newEntry.date);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Registro de Horas</h1>
          <p className="text-muted-foreground">
            Registre las horas diarias dedicadas a tareas
            específicas
          </p>
        </div>

        <Tabs defaultValue="register" className="space-y-6">
          <TabsList>
            <TabsTrigger value="register">
              Registrar Horas
            </TabsTrigger>
            <TabsTrigger value="history">
              Historial Personal
            </TabsTrigger>
          </TabsList>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Nuevo Registro de Tiempo
                </CardTitle>
                <CardDescription>
                  Complete el formulario para registrar sus
                  horas trabajadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={newEntry.clientId}
                        onValueChange={(value) =>
                          setNewEntry({
                            ...newEntry,
                            clientId: value,
                            projectId: "",
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockClients.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id}
                            >
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Project Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="project">Proyecto</Label>
                      <Select
                        value={newEntry.projectId}
                        onValueChange={(value) =>
                          setNewEntry({
                            ...newEntry,
                            projectId: value,
                          })
                        }
                        disabled={!newEntry.clientId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar proyecto" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProjects.map((project) => (
                            <SelectItem
                              key={project.id}
                              value={project.id}
                            >
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="date">Fecha</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEntry.date}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Start Time */}
                    <div className="space-y-2">
                      <Label htmlFor="startTime">
                        Hora de Inicio
                      </Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newEntry.startTime}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            startTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* End Time */}
                    <div className="space-y-2">
                      <Label htmlFor="endTime">
                        Hora de Fin
                      </Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newEntry.endTime}
                        onChange={(e) =>
                          setNewEntry({
                            ...newEntry,
                            endTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* Total Hours Display */}
                    <div className="space-y-2">
                      <Label>Total de Horas</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <span className="text-lg font-semibold">
                          {currentHours.toFixed(2)} horas
                        </span>
                        {dailyTotal > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Total del día:{" "}
                            {(
                              dailyTotal + currentHours
                            ).toFixed(2)}{" "}
                            / 9 horas
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Seleccione una tarea</Label>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant={!newEntry.useCustomTask ? "default" : "outline"}
                          onClick={() => setNewEntry({ ...newEntry, useCustomTask: false, customTask: "" })}
                          disabled={!newEntry.projectId || availableTasks.length === 0}
                        >
                          Tarea del Proyecto
                        </Button>
                        <Button
                          type="button"
                          variant={newEntry.useCustomTask ? "default" : "outline"}
                          onClick={() => setNewEntry({ ...newEntry, useCustomTask: true, task: "" })}
                          disabled={!newEntry.projectId}
                        >
                          Tarea Personalizada
                        </Button>
                      </div>
                    </div>

                    {!newEntry.useCustomTask ? (
                      <div className="space-y-2">
                        <Label htmlFor="task">Tarea del Proyecto</Label>
                        <Select
                          value={newEntry.task}
                          onValueChange={(value) =>
                            setNewEntry({
                              ...newEntry,
                              task: value,
                            })
                          }
                          disabled={!newEntry.projectId || availableTasks.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={availableTasks.length === 0 ? "No hay tareas disponibles" : "Seleccionar tarea"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTasks.map((task, index) => (
                              <SelectItem key={index} value={task}>
                                {task}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {availableTasks.length === 0 && newEntry.projectId && (
                          <p className="text-sm text-muted-foreground">
                            Este proyecto no tiene tareas predefinidas. Use "Tarea Personalizada".
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="customTask">Descripción de la Tarea</Label>
                        <Textarea
                          id="customTask"
                          value={newEntry.customTask}
                          onChange={(e) =>
                            setNewEntry({
                              ...newEntry,
                              customTask: e.target.value,
                            })
                          }
                          placeholder="Describa la tarea realizada..."
                          rows={3}
                          required={newEntry.useCustomTask}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      type="submit"
                      className="flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Registro
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClear}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Historial Personal</CardTitle>
                <CardDescription>
                  Sus registros de tiempo anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay registros de tiempo aún
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Tarea</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Fin</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userEntries
                        .sort(
                          (a, b) =>
                            b.date.getTime() - a.date.getTime(),
                        )
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              {entry.date.toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {getClientName(entry.clientId)}
                            </TableCell>
                            <TableCell>
                              {getProjectName(entry.projectId)}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {entry.task}
                            </TableCell>
                            <TableCell>
                              {entry.startTime}
                            </TableCell>
                            <TableCell>
                              {entry.endTime}
                            </TableCell>
                            <TableCell className="font-medium">
                              {entry.totalHours}h
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Daily Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumen del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getTotalDailyHours(
                    new Date().toISOString().split("T")[0],
                  ).toFixed(1)}
                  h
                </div>
                <p className="text-sm text-muted-foreground">
                  Horas Hoy
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userEntries
                    .reduce(
                      (sum, entry) => sum + entry.totalHours,
                      0,
                    )
                    .toFixed(1)}
                  h
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Semana
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userEntries.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Registros Totales
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
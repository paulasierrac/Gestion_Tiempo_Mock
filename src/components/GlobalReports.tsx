import React, { useState } from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react';
import { mockTimeEntries, mockClients, getClientName, getProjectName, getUserName } from './mockData';
import { toast } from 'sonner@2.0.3';

export default function GlobalReports() {
  const [filters, setFilters] = useState({
    clientId: 'all',
    projectId: 'all',
    userId: 'all',
    startDate: '',
    endDate: '',
    month: '2024-10'
  });

  const users = [
    { id: '3', name: 'Carlos Desarrollador' },
    { id: '4', name: 'Ana Desarrolladora' }
  ];

  // Filter entries based on current filters
  const filteredEntries = mockTimeEntries.filter(entry => {
    if (filters.clientId && filters.clientId !== 'all' && entry.clientId !== filters.clientId) return false;
    if (filters.userId && filters.userId !== 'all' && entry.userId !== filters.userId) return false;
    if (filters.startDate && entry.date < new Date(filters.startDate)) return false;
    if (filters.endDate && entry.date > new Date(filters.endDate)) return false;
    if (filters.month) {
      const [year, month] = filters.month.split('-').map(Number);
      if (entry.date.getFullYear() !== year || entry.date.getMonth() !== month - 1) return false;
    }
    return true;
  });

  // Generate chart data
  const userHoursData = users.map(user => ({
    name: user.name,
    hours: filteredEntries
      .filter(entry => entry.userId === user.id)
      .reduce((sum, entry) => sum + entry.totalHours, 0)
  }));

  const clientHoursData = mockClients.map(client => ({
    name: client.name,
    hours: filteredEntries
      .filter(entry => entry.clientId === client.id)
      .reduce((sum, entry) => sum + entry.totalHours, 0)
  })).filter(item => item.hours > 0);

  const dailyHoursData = (() => {
    const dailyData: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
      const date = entry.date.toISOString().split('T')[0];
      dailyData[date] = (dailyData[date] || 0) + entry.totalHours;
    });
    
    return Object.entries(dailyData)
      .map(([date, hours]) => ({ date, hours }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14); // Last 14 days
  })();

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const averageDaily = totalHours / (filteredEntries.length > 0 ? new Set(filteredEntries.map(e => e.date.toDateString())).size : 1);

  const exportData = (format: 'excel' | 'json') => {
    const exportData = {
      filters,
      summary: {
        totalEntries: filteredEntries.length,
        totalHours,
        averageDaily: Math.round(averageDaily * 100) / 100
      },
      entries: filteredEntries.map(entry => ({
        user: getUserName(entry.userId),
        client: getClientName(entry.clientId),
        project: getProjectName(entry.projectId),
        task: entry.task,
        date: entry.date.toLocaleDateString(),
        startTime: entry.startTime,
        endTime: entry.endTime,
        totalHours: entry.totalHours
      }))
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-global-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Reporte exportado en JSON');
    } else {
      toast.success('Exportación a Excel iniciada (funcionalidad mock)');
    }
  };

  const clearFilters = () => {
    setFilters({
      clientId: 'all',
      projectId: 'all',
      userId: 'all',
      startDate: '',
      endDate: '',
      month: '2024-10'
    });
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Reportes Globales</h1>
          <p className="text-muted-foreground">Análisis completo de todas las horas registradas en el sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Horas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours}h</div>
              <p className="text-xs text-muted-foreground">
                {filteredEntries.length} registros
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(averageDaily * 100) / 100}h</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientHoursData.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desarrolladores</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filterClient">Cliente</Label>
                <Select 
                  value={filters.clientId}
                  onValueChange={(value) => setFilters({...filters, clientId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {mockClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterUser">Usuario</Label>
                <Select 
                  value={filters.userId}
                  onValueChange={(value) => setFilters({...filters, userId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los usuarios</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filterMonth">Mes</Label>
                <Select 
                  value={filters.month}
                  onValueChange={(value) => setFilters({...filters, month: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-09">Septiembre 2024</SelectItem>
                    <SelectItem value="2024-10">Octubre 2024</SelectItem>
                    <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                />
              </div>

              <div className="space-y-2 flex items-end">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Hours by User */}
          <Card>
            <CardHeader>
              <CardTitle>Horas por Desarrollador</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userHoursData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hours by Client */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clientHoursData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="hours"
                  >
                    {clientHoursData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daily Hours Trend */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tendencia Diaria (Últimos 14 días)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyHoursData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Registros Detallados</CardTitle>
                <CardDescription>
                  {filteredEntries.length} registros encontrados
                </CardDescription>
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
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No se encontraron registros con los filtros aplicados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Proyecto</TableHead>
                      <TableHead>Tarea</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Inicio</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries
                      .sort((a, b) => b.date.getTime() - a.date.getTime())
                      .map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{getUserName(entry.userId)}</TableCell>
                        <TableCell>{getClientName(entry.clientId)}</TableCell>
                        <TableCell>{getProjectName(entry.projectId)}</TableCell>
                        <TableCell className="max-w-xs truncate">{entry.task}</TableCell>
                        <TableCell>{entry.date.toLocaleDateString()}</TableCell>
                        <TableCell>{entry.startTime}</TableCell>
                        <TableCell>{entry.endTime}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{entry.totalHours}h</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
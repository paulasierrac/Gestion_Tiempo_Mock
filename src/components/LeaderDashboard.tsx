import React, { useState } from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Calendar, Download, ChevronDown, ChevronUp, Users, FileDown } from 'lucide-react';
import { mockTimeEntries, getHourColor, getUserName, getClientName, getProjectName } from './mockData';
import { toast } from 'sonner@2.0.3';

export default function LeaderDashboard() {
  const [selectedMonth, setSelectedMonth] = useState('2024-10');
  const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());

  // Mock developers under this leader
  const developers = [
    { id: '3', name: 'Carlos Desarrollador' },
    { id: '4', name: 'Ana Desarrolladora' }
  ];

  // Generate calendar for selected month
  const generateCalendar = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    
    const calendar = [];
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(new Date(year, month - 1, i));
    }
    return calendar;
  };

  const getDayHours = (developerId: string, date: Date) => {
    return mockTimeEntries
      .filter(entry => 
        entry.userId === developerId && 
        entry.date.toDateString() === date.toDateString()
      )
      .reduce((sum, entry) => sum + entry.totalHours, 0);
  };

  const getDayEntries = (developerId: string, date: Date) => {
    return mockTimeEntries.filter(entry => 
      entry.userId === developerId && 
      entry.date.toDateString() === date.toDateString()
    );
  };

  const toggleCell = (developerId: string, date: Date) => {
    const cellKey = `${developerId}-${date.toISOString()}`;
    const newExpanded = new Set(expandedCells);
    if (newExpanded.has(cellKey)) {
      newExpanded.delete(cellKey);
    } else {
      newExpanded.add(cellKey);
    }
    setExpandedCells(newExpanded);
  };

  const isCellExpanded = (developerId: string, date: Date): boolean => {
    const cellKey = `${developerId}-${date.toISOString()}`;
    return expandedCells.has(cellKey);
  };

  const exportJSON = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const data = {
      mes: selectedMonth,
      lider: 'María Líder',
      desarrolladores: developers.map(dev => ({
        nombre: dev.name,
        dias: calendar
          .map(date => {
            const entries = getDayEntries(dev.id, date);
            if (entries.length === 0) return null;
            return {
              fecha: date.toISOString().split('T')[0],
              total_horas: getDayHours(dev.id, date),
              detalle: entries.map(entry => ({
                proyecto: getProjectName(entry.projectId),
                tarea: entry.task,
                inicio: entry.startTime,
                fin: entry.endTime,
                horas: entry.totalHours
              }))
            };
          })
          .filter(Boolean)
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${selectedMonth}.json`;
    a.click();
    toast.success('Reporte JSON exportado exitosamente');
  };

  const exportExcel = async () => {
    try {
      // Usar la librería xlsx para exportar a Excel
      const XLSX = await import('xlsx');
      
      const [year, month] = selectedMonth.split('-').map(Number);
      const excelData: any[] = [];
      
      developers.forEach(dev => {
        calendar.forEach(date => {
          const entries = getDayEntries(dev.id, date);
          entries.forEach(entry => {
            excelData.push({
              Mes: selectedMonth,
              Día: date.toLocaleDateString('es-ES'),
              Desarrollador: dev.name,
              Cliente: getClientName(entry.clientId),
              Proyecto: getProjectName(entry.projectId),
              Tarea: entry.task,
              Inicio: entry.startTime,
              Fin: entry.endTime,
              TotalHoras: entry.totalHours
            });
          });
        });
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
      XLSX.writeFile(workbook, `reporte-${selectedMonth}.xlsx`);
      toast.success('Reporte Excel exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar Excel');
      console.error(error);
    }
  };

  const calendar = generateCalendar();
  const [year, month] = selectedMonth.split('-').map(Number);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Panel del Líder</h1>
          <p className="text-muted-foreground">Monitoree las horas trabajadas por su equipo de desarrolladores</p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Resumen Mensual del Equipo</CardTitle>
                <CardDescription>Vista mensual agrupada por desarrollador</CardDescription>
              </div>
              <div className="flex space-x-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-40">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-09">Septiembre 2024</SelectItem>
                    <SelectItem value="2024-10">Octubre 2024</SelectItem>
                    <SelectItem value="2024-11">Noviembre 2024</SelectItem>
                    <SelectItem value="2025-01">Enero 2025</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={exportExcel}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar Excel
                </Button>
                <Button variant="outline" onClick={exportJSON}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar JSON
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Monthly Calendar Grid */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <div className="space-y-4">
                {/* Header with days */}
                <div className="flex gap-1">
                  <div className="font-medium p-2 w-48 flex-shrink-0">Desarrollador</div>
                  <div className="flex gap-1 flex-1 min-w-0 overflow-x-auto">
                    {calendar.map((date, index) => (
                      <div key={index} className="text-center p-1 text-xs font-medium w-12 flex-shrink-0">
                        <div>{date.getDate()}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Developer rows */}
                {developers.map((developer) => (
                  <div key={developer.id} className="space-y-2">
                    <div className="flex gap-1">
                      <div className="flex items-center p-2 font-medium w-48 flex-shrink-0">
                        <Users className="h-4 w-4 mr-2" />
                        {developer.name}
                      </div>
                      <div className="flex gap-1 flex-1 min-w-0 overflow-x-auto">
                        {calendar.map((date, index) => {
                          const hours = getDayHours(developer.id, date);
                          const colorClass = getHourColor(hours);
                          const hasEntries = getDayEntries(developer.id, date).length > 0;
                          const isExpanded = isCellExpanded(developer.id, date);
                          
                          return (
                            <div key={index} className="w-12 flex-shrink-0">
                              <div
                                className={`
                                  h-10 flex flex-col items-center justify-center text-xs cursor-pointer
                                  border border-gray-200 rounded ${colorClass}
                                  hover:ring-2 hover:ring-blue-300 transition-all
                                  ${isExpanded ? 'ring-2 ring-blue-500' : ''}
                                `}
                                onClick={() => hasEntries && toggleCell(developer.id, date)}
                                title={`${hours}h trabajadas el ${date.toLocaleDateString()}`}
                              >
                                <span className="font-medium">{hours > 0 ? `${hours}h` : ''}</span>
                                {hasEntries && (
                                  <span className="text-[8px]">
                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Expanded details for each day */}
                    {calendar.some(date => isCellExpanded(developer.id, date)) && (
                      <div className="ml-48 pl-2 space-y-2">
                        {calendar.map((date, index) => {
                          if (!isCellExpanded(developer.id, date)) return null;
                          const entries = getDayEntries(developer.id, date);
                          
                          return (
                            <div key={index} className="bg-muted/50 rounded-md p-3 text-sm">
                              <div className="font-medium mb-2 flex items-center justify-between">
                                <span>📅 {date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                <span className="text-xs text-muted-foreground">Total: {getDayHours(developer.id, date)}h</span>
                              </div>
                              <div className="space-y-1">
                                {entries.map((entry) => (
                                  <div key={entry.id} className="grid grid-cols-5 gap-2 py-1 border-b border-border/50 last:border-0">
                                    <div className="col-span-2">
                                      <div className="font-medium text-xs">{entry.task}</div>
                                      <div className="text-[11px] text-muted-foreground">
                                        {getProjectName(entry.projectId)}
                                      </div>
                                    </div>
                                    <div className="text-xs text-center">{entry.startTime}</div>
                                    <div className="text-xs text-center">{entry.endTime}</div>
                                    <div className="text-xs text-center font-medium">{entry.totalHours}h</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex items-center space-x-4 text-sm">
              <span>Leyenda:</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>0 horas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                <span>1-4 horas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span>5-8 horas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-200 rounded"></div>
                <span>9+ horas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Desarrolladores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{developers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Horas del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockTimeEntries
                  .filter(entry => 
                    developers.some(dev => dev.id === entry.userId) &&
                    entry.date.getMonth() === month - 1 &&
                    entry.date.getFullYear() === year
                  )
                  .reduce((sum, entry) => sum + entry.totalHours, 0)
                }h
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Promedio Diario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  mockTimeEntries
                    .filter(entry => 
                      developers.some(dev => dev.id === entry.userId) &&
                      entry.date.getMonth() === month - 1 &&
                      entry.date.getFullYear() === year
                    )
                    .reduce((sum, entry) => sum + entry.totalHours, 0) / calendar.length
                )}h
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
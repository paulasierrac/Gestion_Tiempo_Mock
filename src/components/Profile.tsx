import React, { useState } from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { User, Mail, Lock, Globe, Clock, Settings, Save } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner@2.0.3';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'es',
    timezone: 'America/Bogota'
  });

  const handleUpdateProfile = () => {
    if (!profile.name || !profile.email) {
      toast.error('Por favor complete los campos requeridos');
      return;
    }
    toast.success('Perfil actualizado exitosamente');
  };

  const handleChangePassword = () => {
    if (!profile.currentPassword || !profile.newPassword || !profile.confirmPassword) {
      toast.error('Por favor complete todos los campos de contraseña');
      return;
    }
    
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }
    
    if (profile.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setProfile({
      ...profile,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    toast.success('Contraseña actualizada exitosamente');
  };

  const handleUpdatePreferences = () => {
    toast.success('Preferencias actualizadas exitosamente');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'leader': return 'default';
      case 'developer': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'leader': return 'Líder';
      case 'developer': return 'Desarrollador';
      default: return role;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Perfil de Usuario</h1>
          <p className="text-muted-foreground">Administre su información personal y preferencias</p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                <Badge variant={getRoleBadgeColor(user.role)}>
                  {getRoleDisplay(user.role)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Información Personal</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualice su información básica de perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      placeholder="Su nombre completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      placeholder="su.email@empresa.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Rol Actual</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <Badge variant={getRoleBadgeColor(user.role)}>
                      {getRoleDisplay(user.role)}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Su rol determina los permisos y funciones disponibles en el sistema
                    </p>
                  </div>
                </div>

                <Button onClick={handleUpdateProfile} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Seguridad
                </CardTitle>
                <CardDescription>
                  Cambie su contraseña y gestione la seguridad de su cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
                      placeholder="Ingrese su contraseña actual"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profile.confirmPassword}
                      onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
                      placeholder="Repita la nueva contraseña"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Consejos de Seguridad</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use al menos 8 caracteres</li>
                    <li>• Incluya letras mayúsculas y minúsculas</li>
                    <li>• Agregue números y símbolos</li>
                    <li>• Evite información personal</li>
                  </ul>
                </div>

                <Button onClick={handleChangePassword} className="w-full md:w-auto">
                  <Lock className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Preferencias
                </CardTitle>
                <CardDescription>
                  Configure las opciones de idioma y zona horaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select 
                      value={profile.language}
                      onValueChange={(value) => setProfile({...profile, language: value})}
                    >
                      <SelectTrigger>
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select 
                      value={profile.timezone}
                      onValueChange={(value) => setProfile({...profile, timezone: value})}
                    >
                      <SelectTrigger>
                        <Clock className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/Lima">Lima (GMT-5)</SelectItem>
                        <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Configuración Actual</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Idioma:</strong> {profile.language === 'es' ? 'Español' : profile.language === 'en' ? 'English' : 'Português'}</p>
                    <p><strong>Zona Horaria:</strong> {profile.timezone}</p>
                    <p><strong>Hora Local:</strong> {new Date().toLocaleString()}</p>
                  </div>
                </div>

                <Button onClick={handleUpdatePreferences} className="w-full md:w-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Activity Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumen de Actividad</CardTitle>
            <CardDescription>Estadísticas de su uso del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <p className="text-sm text-blue-700">Días activos</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">120h</div>
                <p className="text-sm text-green-700">Horas registradas</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">8</div>
                <p className="text-sm text-purple-700">Proyectos participados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
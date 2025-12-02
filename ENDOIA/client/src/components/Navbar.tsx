import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Sparkles, FilePlus, FolderOpen, FileCheck, BarChart3, BookOpen, LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';
import { auth } from '@/lib/firebase';
import PWAInstallButton from '@/components/PWAInstallButton';

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await auth.signOut();
      setLocation('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  }

  const navigateTo = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  if (!user) return null;

  const roleLabels = {
    clinico: 'Clínico',
    tutor: 'Tutor Validador',
    investigador: 'Investigador'
  };

  const roleColors = {
    clinico: 'default',
    tutor: 'secondary',
    investigador: 'outline'
  } as const;

  const isActive = (path: string) => location.startsWith(path);

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <img src="/endoia-logo.svg" alt="ENDOIA" className="w-8 h-8" />
                <span className="font-bold text-lg">ENDOIA</span>
              </div>
              <span className="text-[10px] text-muted-foreground ml-10">AAE–ESE 2025 Classification</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={isActive('/clinico/registrar') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLocation('/clinico/registrar')}
                className="gap-2"
              >
                <FilePlus className="w-4 h-4" />
                Registrar caso
              </Button>

              <Button
                variant={isActive('/clinico/mis-casos') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLocation('/clinico/mis-casos')}
                className="gap-2"
              >
                <FolderOpen className="w-4 h-4" />
                Mis casos
              </Button>

              <Button
                variant={isActive('/biblioteca') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLocation('/biblioteca')}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Biblioteca
              </Button>

              {(role === 'tutor' || role === 'investigador') && (
                <Button
                  variant={isActive('/tutor') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLocation('/tutor')}
                  className="gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  Validar casos
                </Button>
              )}

              {role === 'investigador' && (
                <Button
                  variant={isActive('/investigador/dashboard') ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setLocation('/investigador/dashboard')}
                  className="gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Navigation Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/endoia-logo.svg" alt="ENDOIA" className="w-6 h-6" />
                    ENDOIA
                  </SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col gap-2 mt-6">
                  {/* User Info */}
                  <div className="flex flex-col gap-2 pb-4 border-b mb-2">
                    <span className="text-sm font-medium truncate">{user.email}</span>
                    <Badge variant={roleColors[role]} className="text-xs w-fit">
                      {roleLabels[role]}
                    </Badge>
                  </div>

                  {/* Navigation Links */}
                  <Button
                    variant={isActive('/clinico/registrar') ? 'default' : 'ghost'}
                    className="justify-start gap-2"
                    onClick={() => navigateTo('/clinico/registrar')}
                  >
                    <FilePlus className="w-4 h-4" />
                    Registrar caso
                  </Button>

                  <Button
                    variant={isActive('/clinico/mis-casos') ? 'default' : 'ghost'}
                    className="justify-start gap-2"
                    onClick={() => navigateTo('/clinico/mis-casos')}
                  >
                    <FolderOpen className="w-4 h-4" />
                    Mis casos
                  </Button>

                  <Button
                    variant={isActive('/biblioteca') ? 'default' : 'ghost'}
                    className="justify-start gap-2"
                    onClick={() => navigateTo('/biblioteca')}
                  >
                    <BookOpen className="w-4 h-4" />
                    Biblioteca
                  </Button>

                  {(role === 'tutor' || role === 'investigador') && (
                    <Button
                      variant={isActive('/tutor') ? 'default' : 'ghost'}
                      className="justify-start gap-2"
                      onClick={() => navigateTo('/tutor')}
                    >
                      <FileCheck className="w-4 h-4" />
                      Validar casos
                    </Button>
                  )}

                  {role === 'investigador' && (
                    <Button
                      variant={isActive('/investigador/dashboard') ? 'default' : 'ghost'}
                      className="justify-start gap-2"
                      onClick={() => navigateTo('/investigador/dashboard')}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Dashboard
                    </Button>
                  )}

                  {/* Logout */}
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 mt-4 border-t pt-4"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <PWAInstallButton />
            
            <div className="hidden sm:flex flex-col items-end text-sm">
              <span className="font-medium">{user.email}</span>
              <Badge variant={roleColors[role]} className="text-xs">
                {roleLabels[role]}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

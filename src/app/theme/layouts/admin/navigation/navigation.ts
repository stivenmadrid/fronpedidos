// Importa el guardia de autenticación
import { AuthGuard } from '../../../../Service/auth.guard';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Home',
        title: 'Home',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'elements',
    title: 'UI Components',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Pedidos',
        title: 'Pedidos',
        type: 'collapse',
        classes: 'nav-item',
        icon: 'ti ti-shopping-cart',
        children: [
          {
            id: 'Generarpedidos',
            title: 'Generar pedidos SAP',
            type: 'item',
            classes: 'nav-item',
            url: '/Generar-pedidos',
            icon: 'ti ti-shopping-cart',
            
          },
          
        ]
      },
      {
        id: 'Producción',
        title: 'Producción',
        type: 'collapse',
        classes: 'nav-item',
        url: '/breadcrumb',
        icon: 'ti ti-settings', 
        children: [
        
          {
            id: 'LineaCero',
            title: 'Linea Cero',
            type: 'item',
            classes: 'nav-item',
            url: '/LineaCero',
            icon: 'ti ti-lock', 
            
          }
        ]
      },
      
      {
        id: 'Administracion',
        title: 'Administración',
        type: 'collapse',
        classes: 'nav-item',
        url: '/breadcrumb',
        icon: 'ti ti-settings', 
        children: [
        
          {
            id: 'Seguridad',
            title: 'Seguridad',
            type: 'item',
            classes: 'nav-item',
            url: '/Seguridad',
            icon: 'ti ti-lock', 
            
          }
        ]
      }
    ]
  }
];

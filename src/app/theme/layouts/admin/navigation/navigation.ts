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
            title: 'Generar pedidos',
            type: 'item',
            classes: 'nav-item',
            url: '/Generar-pedidos',
            icon: 'ti ti-shopping-cart',
            
          },
          {
            id: 'pedidosliberados',
            title: 'Pedidos liberados',
            type: 'item',
            classes: 'nav-item',
            url: '/Pedidos-liberados',
            icon: 'ti ti-shopping-cart'
          },
          {
            id: 'pedidoscocina',
            title: 'Pedidos cocina',
            type: 'item',
            classes: 'nav-item',
            url: '/Pedidos-cocina',
            icon: 'ti ti-shopping-cart'
          }
        ]
      },
      {
        id: 'Facturacion',
        title: 'Facturación eletronica',
        type: 'collapse',
        classes: 'nav-item',
        url: '/card',
        icon: 'ti ti-wallet',
        children: [
          {
            id: 'Pagos efectuados',
            title: 'Pagos efectuados',
            type: 'item',
            classes: 'nav-item',
            url: '/breadcrumb',
            icon: 'ti ti-wallet'
          }
        ]
      },
      {
        id: 'Administracion',
        title: 'Administración',
        type: 'collapse',
        classes: 'nav-item',
        url: '/breadcrumb',
        icon: 'ti ti-settings', // Nuevo icono para Administración
        children: [
          {
            id: 'Inventario',
            title: 'Inventario',
            type: 'item',
            classes: 'nav-item',
            url: '/Inventarios',
            icon: 'ti ti-package'
          },
          {
            id: 'Seguridad',
            title: 'Seguridad',
            type: 'item',
            classes: 'nav-item',
            url: '/Seguridad',
            icon: 'ti ti-lock', // Nuevo icono para Seguridad
            
          }
        ]
      }
    ]
  }
];

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ 
  customItems = null, 
  showHome = true,
  className = '' 
}) => {
  const location = useLocation();

  // Route mapping for breadcrumb labels
  const routeLabels = {
    '/home-dashboard': 'Dashboard',
    '/hazard-reporting-form': 'Report Hazard',
    '/interactive-risk-map': 'Risk Map',
    '/my-alerts-dashboard': 'My Alerts',
    '/login-registration': 'Login',
    '/about-help-center': 'About & Help'
  };

  // Generate breadcrumb items from current path
  const generateBreadcrumbs = () => {
    if (customItems) return customItems;

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [];

    // Add home if requested and not already on home
    if (showHome && location?.pathname !== '/home-dashboard') {
      breadcrumbs?.push({
        label: 'Home',
        path: '/home-dashboard',
        icon: 'Home'
      });
    }

    // Add current page
    const currentPath = `/${pathSegments?.join('/')}`;
    const currentLabel = routeLabels?.[currentPath] || 
      pathSegments?.[pathSegments?.length - 1]?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase()) || 'Page';

    // Only add current page if it's not home or if we're not showing home
    if (currentPath !== '/home-dashboard' || !showHome) {
      breadcrumbs?.push({
        label: currentLabel,
        path: currentPath,
        current: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render if only one item and it's the current page
  if (breadcrumbs?.length <= 1 && breadcrumbs?.[0]?.current) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((item, index) => (
          <li key={item?.path || index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            
            {item?.current ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                {item?.icon && (
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                )}
                <span>{item?.label}</span>
              </span>
            ) : (
              <Link
                to={item?.path}
                className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors duration-150 focus-ocean rounded-sm px-1 py-0.5"
              >
                {item?.icon && (
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                  />
                )}
                <span>{item?.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
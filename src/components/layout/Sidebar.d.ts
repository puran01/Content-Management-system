import * as React from 'react';

declare const Sidebar: React.FC<{
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}>;

export default Sidebar;

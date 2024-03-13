import { IMAGE_PATH, NAVIGATION_ROUTES } from '../constants/constants';

const superAdmin = (url: string) => {
  return [{
    title: 'Dashboard',
    routerLink: NAVIGATION_ROUTES.DASHBOARD,
    image: url.includes(NAVIGATION_ROUTES.DASHBOARD) ? IMAGE_PATH.DASHBOARD_ACTIVE : IMAGE_PATH.DASHBOARD,
    activeCondition: url.includes(NAVIGATION_ROUTES.DASHBOARD),
    isSuperAdmin: true
  },
  {
    title: 'Inventory Management',
    routerLink: NAVIGATION_ROUTES.INVENTORY_MANAGEMENT,
    image: url.includes(NAVIGATION_ROUTES.INVENTORY_MANAGEMENT) ? IMAGE_PATH.INVENTORY_MANAGEMENT_ACTIVE : IMAGE_PATH.INVENTORY_MANAGEMENT,
    activeCondition: url.includes(NAVIGATION_ROUTES.INVENTORY_MANAGEMENT),
    isSuperAdmin: true
  },
  {
    title: 'System Management',
    routerLink: NAVIGATION_ROUTES.SYSTEM_MANAGEMENT,
    image: url.includes(NAVIGATION_ROUTES.SYSTEM_MANAGEMENT) ? IMAGE_PATH.SYSTEM_MANAGEMENT_ACTIVE : IMAGE_PATH.SYSTEM_MANAGEMENT,
    activeCondition: url.includes(NAVIGATION_ROUTES.SYSTEM_MANAGEMENT),
    isSuperAdmin: true
  },
  {
    title: 'Request Management',
    routerLink: NAVIGATION_ROUTES.REQUEST_MANAGEMENT,
    image: url.includes(NAVIGATION_ROUTES.REQUEST_MANAGEMENT) ? IMAGE_PATH.REQUEST_MANAGEMENT_ACTIVE : IMAGE_PATH.REQUEST_MANAGEMENT,
    activeCondition: url.includes(NAVIGATION_ROUTES.REQUEST_MANAGEMENT),
    isSuperAdmin: true
  },
  {
    title: 'Bill Management',
    routerLink: NAVIGATION_ROUTES.BILL_MANAGEMENT,
    image: url.includes(NAVIGATION_ROUTES.BILL_MANAGEMENT) ? IMAGE_PATH.RIGHTS_MANAGEMENT_ACTIVE : IMAGE_PATH.RIGHTS_MANAGEMENT,
    activeCondition: url.includes(NAVIGATION_ROUTES.BILL_MANAGEMENT),
    isSuperAdmin: true
  },
  {
    title: 'IOT Management',
    routerLink: NAVIGATION_ROUTES.IOT_MANAGEMENT,
    image: url.includes(NAVIGATION_ROUTES.IOT_MANAGEMENT) ? IMAGE_PATH.IOT_MANAGEMENT_ACTIVE : IMAGE_PATH.IOT_MANAGEMENT,
    activeCondition: url.includes(NAVIGATION_ROUTES.IOT_MANAGEMENT),
    isSuperAdmin: true
  }
  ];
};
const subAdmin = (url: string) => {
  return [{
    title: 'Dashboard',
    routerLink: NAVIGATION_ROUTES.DASHBOARD,
    image: url.includes(NAVIGATION_ROUTES.DASHBOARD) ? IMAGE_PATH.DASHBOARD_ACTIVE : IMAGE_PATH.DASHBOARD,
    activeCondition: url.includes(NAVIGATION_ROUTES.DASHBOARD),
    isSuperAdmin: false
  },
  ];
};

export default {
  getSuperAdmin: superAdmin,
  getSubAdmin: subAdmin
};

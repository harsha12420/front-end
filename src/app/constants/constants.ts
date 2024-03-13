export const COMMON_ERROR_MSG = {
    SOMETHING_WENT_WRONG: "Something went wrong!!!"
}

export const LOCAL_STORAGE_KEYS = {
    TOKEN: 'token',
    USERNAME: 'username',
    ID: 'id',
    IS_SUPERADMIN: 'isSuperAdmin'
};

export const COOKIES_KEY = {
    REMEMBER_ME_STATUS: 'remember_me_status',
    HEADER_TITLE :'header_title'
};

export const ROUTE_PATH = {
    ABSOLUTE: '',
    AUTH: 'auth',
    LOGIN: 'login',
    ADMIN: 'admin',
    DASHBOARD: "dashboard",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password/:token",
    INVENTORY_MANAGEMENT: 'inventory-management',
    INVENTORY_MANAGEMENT_DETAILS:'inventory-management/details/:inventoryId',
    SYSTEM_MANAGEMENT: 'system-management',
    REQUEST_MANAGEMENT: 'request-management',
    RIGHTS_MANAGEMENT: 'rights-management',
    BILL_MANAGEMENT: 'bill-management',
    SETTINGS: 'settings',
    IOT_MANAGEMENT: 'iot-management',
    IOT_MANAGEMENT_DETAILS: 'iot-management/details/:iIotInventoryId'
}

export const NAVIGATION_ROUTES = {
    DASHBOARD: '/admin/dashboard',
    INVENTORY_MANAGEMENT: '/admin/inventory-management',
    SYSTEM_MANAGEMENT: '/admin/system-management',
    REQUEST_MANAGEMENT: '/admin/request-management',
    RIGHTS_MANAGEMENT: '/admin/rights-management',
    BILL_MANAGEMENT: '/admin/bill-management',
    SETTINGS: '/admin/settings',
    IOT_MANAGEMENT: '/admin/iot-management'
}

export const IMAGE_PATH = {
    DASHBOARD: './../../assets/img/dashborad_inactive.svg',
    DASHBOARD_ACTIVE: './../../assets/img/dashboard_active.svg',
    INVENTORY_MANAGEMENT: './../../assets/img/inventory_inactive.svg',
    INVENTORY_MANAGEMENT_ACTIVE: './../../assets/img/inventory_active.svg',
    SYSTEM_MANAGEMENT: './../../assets/img/system_inactive.svg',
    SYSTEM_MANAGEMENT_ACTIVE: './../../assets/img/system_active.svg',
    REQUEST_MANAGEMENT: './../../assets/img/request_mang_inactive.svg',
    REQUEST_MANAGEMENT_ACTIVE: './../../assets/img/request_mang_active.svg',
    RIGHTS_MANAGEMENT: './../../assets/img/rights_inactive.svg',
    RIGHTS_MANAGEMENT_ACTIVE: './../../assets/img/rights_active.svg',
    IOT_MANAGEMENT_ACTIVE: './../../assets/img/iot_active_image.png',
    IOT_MANAGEMENT: './../../assets/img/iot_inactive_image.png'
}
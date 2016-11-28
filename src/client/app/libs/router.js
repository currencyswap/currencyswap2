'use strict';

var routes = {
    HOME: '/',
    ORDERS: '/orders/',
    ORDER_CREATE: '/orders/create',
    ORDER_DETAIL: '/orders/:orderCode',
    USERS: '/users/',
    USER: 'users/:id',
    MYPROFILE: '/profile',
    SUPPORT: '/support',
    HELP: '/help',
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    NOTIFICATIONS: '/notifications',
    FORGOT_PASSWORD_VERIFY: '/forgotpassword/verify',
    FORGOT_PASSWORD_RESET: '/forgotpassword/reset/'
};

var navigation = [
    {
        route: routes.LOGIN,
        name: 'Login',
        requiredPermissions: []
    },
    {
        route: routes.REGISTER,
        name: 'Register',
        requiredPermissions: []
    },
    {
        route: routes.ORDERS,
        name: 'Orders',
        requiredPermissions: [permissions.VIEW_OWN_ORDERS],
        position: global.MENUBAR,
        icon : 'fa fa-th-list'
    },
    {
        route: routes.USERS,
        name: 'Users',
        requiredPermissions: [permissions.USER_MANAGEMENT],
        position: global.MENUBAR,
        icon : 'fa fa-users'
    },
    {
        route: routes.ORDER_CREATE,
        name: 'Create Order',
        requiredPermissions: [permissions.MAINTAIN_OWN_ORDERS],
        position: global.TOOLSBAR,
        icon : 'fa fa-plus'
    },
    {
        route: routes.SUPPORT,
        name: 'Support',
        requiredPermissions: [permissions.VIEW_OWN_ORDERS, ],
        position: global.TOOLSBAR,
        icon : 'fa fa-support'
    },
    {
        route: routes.HELP,
        name: 'Guideline Information',
        requiredPermissions: [permissions.EDIT_PROFILE],
        position: global.TOOLSBAR,
        icon : 'fa fa-question-circle'
    },
    {
        route: routes.NOTIFICATIONS,
        name: 'Notification',
        requiredPermissions: [permissions.EDIT_PROFILE],
        position: global.TOOLSBAR,
        icon : 'glyphicon glyphicon-envelope'
    },
    {
        route: routes.MYPROFILE,
        name: 'Profile',
        requiredPermissions: [permissions.EDIT_PROFILE],
        position: global.TOOLSBAR,
        icon : 'fa fa-user'
    },
    {
        route: routes.LOGOUT,
        name: 'Logout',
        requiredPermissions: [permissions.EDIT_PROFILE],
        position: global.TOOLSBAR,
        icon : 'fa fa-sign-out'
    }
    
];

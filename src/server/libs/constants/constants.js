module.exports = {
    MSG: {
        NEW_MEMBER_TITLE : 'New member registered',
        NEW_MEMBER_CONTENT : 'The New member has just joint the application',
        APPROVAL_TITLE : 'Welcome new member',
        APPROVAL_CONTENT : 'You have just been approved to use this application',
        ORDER_SWAP_TITLE : 'Request Swapping',
        ORDER_EXPIRE_SOON_TITLE : 'Your Order Expiring Soon'
    },
    PASSWORD_FIELD: 'password',
    STATUS_FIELD: 'status',
    RESET_PWD_REDIS_VALUE: 'resetPassword',
    BLOCKED_USER: 'Blocked User',
    ONE_DAY_IN_SECONDS: 24 * 60 * 60,
    HASHTAG_AND_EXCLAMATION: '#!',
    RESET_CODE_DELIMITER: '|',
    SLASH: '/',
    CLIENT_RESET_PWD_PATH: '/forgotpassword/reset',
    CLIENT_ACTIVE_ACC_PATH: '/register',
    RESET_CODE_PARAM: 'resetCode',
    ACTIVE_REGISTER_PARAM: 'activeCode',
    QUESTION_MARK: '?',
    ENCRYPTION_PWD: 'CS-Encryption-Pwd',
    ENCRYPTION_ALGORITHM: 'aes192',
    USER_STATUSES: {
        NEW: 'New', //After successful registration
        PENDING_APPROVAL: 'Pending Approval', // after email confirmation, waiting for admin approval
        ACTIVATED: 'Activated', // after admin approval
        BLOCKED: 'Blocked'
    },
    USER_GROUPS: {
        ADMIN_GR: 'Admin',
        STANDARD_USER_GR: 'User',
        BLOCKED_USER_GR: 'Blocked User'
    },
    USER_ROLE: {
        STD_MEMBER: 'Standard Member',
        ADMIN: 'Admin'
    },
    STATUS_TYPE : {
        SUBMITTED: "Submitted",
        SWAPPING: "Swapping",
        CONFIRMED: "Confirmed",
        PENDING: "Pending",
        CLEARED: "Cleared",
        CANCELED: "Canceled",
        EXPIRED: "Expired",
        SUBMITTED_ID: 1,
        SWAPPING_ID: 2,
        CONFIRMED_ID: 3,
        PENDING_ID: 4,
        CLEARED_ID: 5,
        CANCELED_ID: 6,
        EXPIRED_ID: 7
    },
    MEMBER_GROUP_MODEL_FIELD: {
        GROUP_ID: 'groupId'
    },
    // HOST: 'http://localhost:3000',
    HTTP_SUCCESS_CODE: 200,
    HTTP_FAILURE_CODE: 299
};

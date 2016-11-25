module.exports = {
    MSG: {
        NEW_MEMBER_TITLE : 'New member registered',
        NEW_MEMBER_CONTENT : 'The New member has just joint the application',
        APPROVAL_TITLE : 'Welcome new member',
        APPROVAL_CONTENT : 'You have just been approved to use this application'
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
    CLIENT_ACTIVE_ACC_PATH: '/register/active',
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
    // HOST: 'http://localhost:3000',
    HTTP_SUCCESS_CODE: 200,
    HTTP_FAILURE_CODE: 299
};

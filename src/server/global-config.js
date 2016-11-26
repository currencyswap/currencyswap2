'use strict';
/**
 * @author Viet Nghiem
 */
module.exports = {
        'debug': process.env.ENABLE_DEBUG,
        'isProd': (process.env.NODE_ENV == 'production'),
        'title' : process.env.APP_NAME || 'Currency Swap',
        'footer' : process.env.APP_FOOTER || 'Copyright &copy; 2016',
        'host': process.env.APP_HOST || 'http://localhost:3000',
        'redis': {
            'host': process.env.REDIS_HOST || 'localhost',
            'port': process.env.REDIS_PORT || 6379,
            'db': parseInt(process.env.REDIS_DB) || 0,
            'pass': process.env.REDIS_PASSWORD || '',
            'ttl': process.env.REDIS_TTL || 3600,
            'disableTTL': false,
            'prefix': process.env.REDIS_PREFIX || 'currencysess:'
        },
        'smtp' : {
            'host' : process.env.SMTP_HOST || 'localhost',
            'port': process.env.SMTP_PORT || 25,
            'username': process.env.SMTP_USER,
            'password': process.env.SMTP_PASSWORD
        },
        'mailSender': {
            'sender': process.env.SYSTEM_EMAIL_FROM || 'currencyswap@com',
            'subject': process.env.SYSTEM_EMAIL_SUBJECT || '[Currency-Swap]',
          },
        'paging' : {
            'activityLogs': 4
        },
        'dateFormat' : {
            'datetime': 'dd-mm-yy HH:MM',
            'date': 'mmm dd,yyyy',
            'time': 'HH:MM:ss'
        },
        'mediaFolder': process.env.SYSTEM_DIR_MEDIA || './media',
        'logs' : process.env.SYSTEM_DIR_LOGS || './logs',
        'tokenExpired' : '1 d'
};

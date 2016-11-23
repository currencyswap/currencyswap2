'use strict';
/**
 * @author Viet Nghiem
 */
module.exports = {
  'CSwapDB': {
    'name': 'CSwapDB',
    'connector': process.env.DATABASE_CONNECTOR || 'mysql',
    'host': process.env.DATABASE_HOST || 'localhost',
    'port': process.env.DATABASE_PORT || 3306,
    'url': process.env.DATABASE_URL || '',
    'database': process.env.DATABASE_NAME || 'CurrencySwapDB',
    'user': process.env.DATABASE_USER || 'CSwapUser',
    'password': process.env.DATABASE_PASSWORD,
    'server': {
      'auto_reconnect': true,
      'reconnectTries': 100,
      'reconnectInterval': 1000
    }
  }
};

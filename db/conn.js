/**
 * Database connection.
 *
 * @author yangzb0922@163.com
 * @date 2017/11/29
 * @version 1.0.0
 */

'use strict';

const Sequelize = require('sequelize');
const CONFIG = require('../config/db_config');

const {
    host,
    port,
    db_name,
    user,
    password
// } = CONFIG[process.env.CMS_ENV];
} = CONFIG['development'];

try {
    module.exports = new Sequelize(
        db_name,
        user,
        password,
        {
            host: host,
            port: port,
            dialect: 'mysql',
            dialectOptions: {
                timezone: '+08:00',
                connectTimeout: 30000,
                acquireTimeout: 30000
            },
            pool: {
                max: 8,
                min: 0,
                idle: 10000
            },
            define: {
                timestamps: false,
                underscored: true
            },
            operatorsAliases: false
        }
    );
} catch (err) {
    throw err;
}

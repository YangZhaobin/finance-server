/**
 * Application configuration.
 *
 * @author yangzb0922@163.com
 * @version 1.0.0
 * @date 2017/11/29
 */

'use strict';

const pkg = require('../package.json');

module.exports = {
    name: pkg.name || 'Doraemon',
    version: pkg.version,
    version_code: 'Brave Heart',
    port: 3001,
    theme: 'default',
    template: 'v2.0'
};

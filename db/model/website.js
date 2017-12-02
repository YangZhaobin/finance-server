/**
 * Defines Website orm.
 *
 * @author yangzb0922@163.com
 * @date 2017/11/29
 * @version 1.0.0
 */

'use strict';

const sequelize = require('../conn');
const Sequelize = require('sequelize');

const Artical = require('./artical');

const Website = sequelize.define('website', {
    // 门户网站id
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        defaultValue: 0,
        autoIncrement: true
    },
    // 门户网站名称
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // 门户网站描述
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // 门户网站url
    url: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'website'
});

Website.findAllWebsite = () => {
    return Website
    .findAll()
    .catch(err => {
        throw err;
    });
};

Website.findWebsiteById = id => {
    return Website
    .findOne({
        where: {
            id: id
        }
    })
    .catch(err => {
        throw err;
    });
};

// Website.createNewWebsite = () => {
//     return Website.create();
// };

module.exports = Website;
/**
 * Defines Finance orm.
 *
 * @author yangzb0922@163.com
 * @date 2017/11/29
 * @version 1.0.0
 */

'use strict';

const sequelize = require('../conn');
const Sequelize = require('sequelize');

const Finance = sequelize.define('finance', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    // 任务描述
    desc: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // 任务是多执行者还是单执行者
    // multiple: { type: Sequelize.BOOLEAN, defaultValue: 1 },
    // 任务执行者，json字符串格式的数组
    // executor: { type: Sequelize.STRING, defaultValue: '' },
    // 任务依赖
    depends: {
        type: Sequelize.STRING,
        allowNull: true
    },
    weight: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    // 任务创建时间
    created: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    timestamps: false,
    tableName: 'task'
});

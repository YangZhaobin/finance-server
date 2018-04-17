/*
 * Defines Classification orm.
 * 
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 15:34:57 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-04-17 20:36:32
 */


const sequelize = require('../conn');
const Sequelize = require('sequelize');

const Classification = sequelize.define('classification', {
    // 分类id
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        defaultValue: 0,
        autoIncrement: true
    },
    // 分类标签名
    word: {
        type: Sequelize.STRING,
        allowNull: true
    },
    // 出现次数
    count: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, {
    timestamps: false,
    tableName: 'classification'
});

Classification.findAllTags = () => {
    return Classification
    .findAll()
    .catch(err => {
        throw err;
    });
};

Classification.addTag = (tag) => {
    return Classification
    .create({
        tag
    })
    .catch(err => {
        throw err;
    });
};

Classification.addMultiTags = (tags) => {
    let records = tags.map(item => {
        return item;
    });
    return Classification
    .bulkCreate(records)
    .catch(err => {
        throw err;
    });
};

Classification.deleteAllTags = () => {
    return Classification
    .truncate()
    .catch(err => {
        throw err;
    });
};

module.exports = Classification;
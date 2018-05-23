/*
 * Defines Classification orm.
 * 
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 15:34:57 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-05-17 17:16:56
 */


const sequelize = require('../conn');
const Sequelize = require('sequelize');

const Collection = sequelize.define('collection', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
    // // 用户名
    // username: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    // // 密码
    // artical_id: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // }
}, {
    timestamps: false,
    tableName: 'collection'
});

Collection.findCollection = (username, artical_id) => {
    return Collection
    .findOne({
        where: {
            username,
            artical_id
        }
    })
    .catch(err => {
        throw err;
    });
};

Collection.addCollection = (collection) => {
    return Collection
    .create(collection)
    .catch(err => {
        throw err;
    });
};

Collection.delCollection = (username, artical_id) => {
    let where = {};
    username && ( where.username = username );
    artical_id && ( where.artical_id = artical_id );
    return Collection
    .destroy({
        where
    })
    .catch(err => {
        throw err;
    });
};

module.exports = Collection;
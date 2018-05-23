/*
 * Defines Classification orm.
 * 
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 15:34:57 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-05-17 13:39:28
 */


const sequelize = require('../conn');
const Sequelize = require('sequelize');
const Artical = require('./artical');
const Collection = require('./collection');

const User = sequelize.define('user', {
    // 用户名
    username: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    // 密码
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'user'
});

User.findAllUser = () => {
    return User
    .findAll()
    .catch(err => {
        throw err;
    });
};

User.findByUsername = (username) => {
    return User
    .findOne({
        where: {
            username
        }
    })
    .catch(err => {
        throw err;
    });
};

User.findUser = (username, password) => {
    return User
    .findOne({
        where: {
            username,
            password
        }
    })
    .catch(err => {
        throw err;
    });
};

User.findCollectionByUsername = (username, limit, offset) => {
    limit = parseInt(limit);
    offset = parseInt(offset);
    return User
    .findAndCountAll({
        where: {
            username
        },
        limit,
        offset,
        attributes: [
            'username'
        ],
        include: [{
            model: Artical
        }]
    })
    .catch(err => {
        throw err;
    });
};

User.addUser = (user) => {
    return User
    .create(user)
    .catch(err => {
        throw err;
    });
};

User.updateUser = (user) => {
    let { username, password } = user;
    return User
    .update(user, {
        where: {
            username
        }
    })
    .catch(err => {
        throw err;
    });
};

User.addMultiUsers = (users) => {
    let records = users.map(item => {
        return item;
    });
    return User
    .bulkCreate(records)
    .catch(err => {
        throw err;
    });
};

User.deleteUserByUsername = (username) => {
    return User
    .destroy({
        where: {
            username
        }
    })
    .catch(err => {
        throw err;
    });
}

User.deleteAllUsers = () => {
    return User
    .truncate()
    .catch(err => {
        throw err;
    });
};


Artical.belongsToMany(User, { through: Collection, foreignKey: 'artical_id' });
User.belongsToMany(Artical, { through: Collection, foreignKey: 'username' });

module.exports = User;
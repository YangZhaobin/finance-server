/**
 * Defines Artical orm.
 *
 * @author yangzb0922@163.com
 * @date 2017/11/29
 * @version 1.0.0
 */

'use strict';

const sequelize = require('../conn');
const Sequelize = require('sequelize');

const Website = require('./website');

const helper = require('../../utils/helpers/index');

const Artical = sequelize.define('artical', {
    // 文章id
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    // 所属网站id
    website_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // 文章名称
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // 文章地址
    url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    // 文章分类
    type: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'artical'
});

Artical.findAllArticalsNoPage = () => {
    return Artical
    .findAndCountAll({
        attributes: [
            'id', 'website_id', 'title', 'url'
        ],
        include: [{
            model: Website,
            as: 'Website'
        }]
    })
    .catch(err => {
        throw err;
    });
};

Artical.findAllArticals = (limit, offset) => {
    limit = parseInt(limit);
    offset = parseInt(offset);
    return Artical
    .findAndCountAll({
        limit,
        offset,
        attributes: [
            'id', 'website_id', 'title', 'url'
        ],
        include: [{
            model: Website,
            as: 'Website'
        }]
    })
    .catch(err => {
        throw err;
    });
};

Artical.findById = (id) => {
    return Artical
    .findOne({
        where: {
            id: id
        }
    })
    .catch(err => {
        throw err;
    });
};

Artical.findArticalsByTitle = (title, site, type, limit, offset) => {
    limit = parseInt(limit);
    offset = parseInt(offset);
    let where = {
        title: {
            $like: '%title%'
        }
    };
    type && (where.type = type);

    let subWhere = {};
    site && (subWhere.id = site);

    return Artical
    .findAndCountAll({
        where,
        offset,
        limit,
        attributes: [
            'id', 'title', 'url'
        ],
        include: [{
            model: Website,
            as: 'Website',
            where: subWhere
        }]
    })
    .catch(err => {
        throw err;
    });
};

Artical.findAllArticalsByWeb = (id, type, limit, offset) => {
    limit = parseInt(limit);
    offset = parseInt(offset);
    let where = {};
    type && (where.type = type);
    return Artical
    .findAndCountAll({
        where,
        limit,
        offset,
        include: [{
            model: Website,
            where: {
                id
            },
            as: 'Website'
        }]
    })
    .catch(err => {
        throw err;
    });
};

Artical.findArticalsByType = (type, limit, offset) => {
    limit = parseInt(limit);
    offset = parseInt(offset);
    let where = {};
    type && (where.type = type);
    return Artical
    .findAndCountAll({
        where,
        limit,
        offset,
        attributes: [
            'id', 'website_id', 'title', 'url'
        ],
        include: [{
            model: Website,
            as: 'Website'
        }]
    })
    .catch(err => {
        throw err;
    });
};

Artical.addArtical = ({title, url, website_id, type}) => {
    let id = helper.generateId();
    return Artical
    .create({
        id,
        title,
        url,
        website_id,
        type
    })
    .catch(err => {
        throw err;
    });
}

Artical.addMultiArticals = (articals) => {
    let records = articals.map(item => {
        item.id = helper.generateId();
        return item;
    });
    
    return Artical
    .bulkCreate(records)
    .catch(err => {
        throw err;
    });
}

Artical.deleteArticalById = (id) => {
    return Artical
    .destroy({
        where: {
            id
        }
    })
    .catch(err => {
        throw err;
    });
}

Artical.deleteAllArticals = () => {
    return Artical
    .destroy({
        truncate: true
    })
    .catch(err => {
        throw err;
    });
}

Artical.belongsTo(Website, {
    foreignKey: 'website_id',
    as: 'Website'
});

Website.hasMany(Artical, {
    foreignKey: 'website_id',
    as: 'Artical'
});

module.exports = Artical;
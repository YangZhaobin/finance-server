const router = require('koa-router')();
const Website = require('../controllers/website');

router.prefix('/website');

router.get('/', Website.getAllWebsites);

module.exports = router;

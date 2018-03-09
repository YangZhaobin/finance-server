const router = require('koa-router')();
const Artical = require('../controllers/artical');

router.prefix('/artical');

router.get('/detail/:id', Artical.getArticalById);

router.get('/list', Artical.getAllArticals);  

router.get('/list/nopage', Artical.getAllArticalsNoPage);  

router.get('/list/site', Artical.getAllArticalsByWeb);

router.get('/list/type', Artical.getAllArticalsByType);

router.get('/list/title', Artical.getAllArticalsByTitle); //

module.exports = router;

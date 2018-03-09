/*
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 16:07:01 
 * @Last Modified by:   yangzhaobin 
 * @Last Modified time: 2018-03-09 16:07:01 
 */

const router = require('koa-router')();
const Classification = require('../controllers/classification');

router.prefix('/tags');

router.get('/list', Classification.getAllTags);  

router.delete('/delete_all', Classification.delAllTags);

module.exports = router;

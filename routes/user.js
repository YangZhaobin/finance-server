const router = require('koa-router')();
const User = require('../controllers/user');

router.prefix('/user');

router.get('/list', User.getAllUsers);  

router.get('/get', User.getUserByToken);  

router.get('/collection', User.getCollectionByUsername); 

router.post('/login', User.checkUser);

router.post('/logout', User.logoutUser);  

router.post('/add', User.addUser);

router.post('/collection/add', User.addCollection);

router.post('/collection/delete', User.deleteCollection);

router.post('/update', User.updateUser);

router.post('/delete', User.delUserByUsername); //

module.exports = router;

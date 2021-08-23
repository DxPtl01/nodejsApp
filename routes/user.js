const express = require('express');
const router = express.Router();
const data = require('../data');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const usersData = data.users;

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/post');
    } else {
        res.render('pages/login');
    }
});

router.get('/:id', async (req, res) => {
    //TODO set cookies to authenticate user
    if (!req.session.user) {
        res.render('/pages/login');
    }
    try {
        let user = await usersData.getUserById(req.params.id); // ID string
        res.render('/pages/userpage', user);  //send user data to the info page
    } catch (e) {
        res.render('/pages/error', { error: 'User not found' });
    }
});

//user update info
router.patch('/:id', async (req, res) => {
    //TODO set cookies to authenticate user
    if (!req.session.user) {
        res.render('/pages/login');
    }

    try {
        await usersData.getUserById(req.params.id);
    } catch (e) {
        res.render('/pages/error', { error: 'User not found' });
    }
    let userInfo = req.body;
    const updateuser = await usersData.getUserById(req.params.id);
    let updatedInfo = {};
    updatedInfo.email = updateuser.email;
    updatedInfo.password = updateuser.password;
    updatedInfo.firstName = updateuser.firstName;
    updatedInfo.lastName = updateuser.lastName;
    updatedInfo.userRole = updateuser.userRole;
    updatedInfo.address = updateuser.address;
    if (!userInfo) {
        res.render('/pages/error', { error: 'You must at least update one data to a user' });
        let user = await usersData.getUserById(req.params.id); // ID string
        res.render('/pages/userpage', user);  //send user data to the info page
    }
    if (userInfo.email) {
        if (typeof (userInfo.email) != 'string' || userInfo.email.length == 0) {
            res.render('/pages/error', { error: 'you must update a non-empty string email' });
        }
        updatedInfo.email = userInfo.email;
    }
    if (userInfo.password) {
        if (typeof (userInfo.password) != 'string' || userInfo.password.length == 0) {
            res.render('/pages/error', { error: 'you must update a non-empty string password' });
        }
        let newpass = await bcrypt.hash(userInfo.password, saltRounds);
        updatedInfo.password = newpass;
    }
    if (userInfo.firstName) {
        if (typeof (userInfo.firstName) != 'string' || userInfo.firstName.length == 0) {
            res.render('/pages/error', { error: 'provide valide first name' });
    
        }
        updatedInfo.firstName = userInfo.firstName;
    }
    if (userInfo.lastName) {
        if (typeof (userInfo.lastName) != 'string' || userInfo.lastName.length == 0) {
            res.render('/pages/error', { error: 'provide valide last name' });

        }
        updatedInfo.lastName = userInfo.lastName;
    }
    if (userInfo.userRole) {
        if (typeof (userInfo.userRole) != 'string' || userInfo.userRole.length == 0) {
            res.render('/pages/error', { error: 'provide valide userRole' });

        }
        updatedInfo.userRole = userInfo.userRole;
    }
    if (userInfo.address) {
        if (typeof (userInfo.address) != 'string' || userInfo.address.length == 0) {
            res.render('/pages/error', { error: 'provide valide address' });

        }
        updatedInfo.address = userInfo.address;
    }
    try {
        res.json(await usersData.updateUser(req.params.id,updatedInfo));
      } catch (e) {
        res.sendStatus(500);
      }
});

    router.get('/logout', async (req, res) => {
        req.session.destroy();
        res.render('pages/logout');
    });

    module.exports = router;

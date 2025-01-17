const appRouters = function (app) {
    //get data routers
    // const users = require('./routes/user');
    const home = require('./routes/home');

    app.use('/', home);
    // app.use('/user', users);

};

module.exports = appRouters;
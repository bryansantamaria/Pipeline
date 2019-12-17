const LocalStrategy = require('passport-local').Strategy;
const monk = require('monk');
const pipelineDB = monk('localhost:27017/pipeline');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
            pipelineDB
                .get('users')
                .findOne({ $or: [{ "alias": username }, { "email": username }] },
                    (err, user) => {
                        if (err) throw err;

                        if (!user) {
                            return done(null, false);
                        }

                        bcrypt.compare(password, user.password, (err, authorized) => {
                            if (err) throw err;

                            if (authorized) {
                                return done(null, user);
                            } else {
                                return done(null, false);
                            }
                        });
                    })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        pipelineDB
            .get('users')
            .findOne(id, (err, user) => {
                done(err, user);
            });
    });
}
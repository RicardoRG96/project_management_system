const bcrypt = require('bcrypt');

exports.hashPassword = async (password, next) => {
    const salt = await this.generateSalt(next);

    return bcrypt.hash(password, salt)
        .then(hashedPassword => hashedPassword)
        .catch(err => next(err))
} 

exports.generateSalt = async (next) => {
    const saltRounds = 10;
    
    return bcrypt.genSalt(saltRounds)
        .then(salt => salt)
        .catch(err => next(err))
}

exports.compareSentPasswordWithPasswordStoredInDB = async (sentPassword, storedPassword, next) => {

    return bcrypt.compare(sentPassword, storedPassword)
        .then(matchPassword => matchPassword)
        .catch(err => next(err))
}
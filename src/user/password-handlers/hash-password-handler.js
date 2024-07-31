const bcrypt = require('bcrypt');

const hashPassword = async (password, next) => {
    const salt = await generateSalt(next);

    return bcrypt.hash(password, salt)
        .then(hashedPassword => hashedPassword)
        .catch(err => next(err))
} 

const generateSalt = async (next) => {
    const saltRounds = 10;
    
    return bcrypt.genSalt(saltRounds)
        .then(salt => salt)
        .catch(err => next(err))
}

module.exports = {
    generateSalt,
    hashPassword
}
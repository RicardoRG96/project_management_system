const EventEmitter = require('node:events');
const eventEmitter = new EventEmitter();
const { sendEmail } = require('./email-service-config');

const onRegisterUser = (user) => {
    const emailText = `Hola ${user.username}, ¡bienvenido a nuestra plataforma!`;

    sendEmail(user.email, 'Bienvenido', emailText);
}

const onUserUpdateEmail = (user) => {
    const emailText = `Hola ${user.username}, ¡haz actualizado con éxito tu correo!`;

    sendEmail(user.email, 'Actualización de correo', emailText);
}

const onUserUpdatePassword = (user) => {
    const emailText = `Hola ${user.username}, ¡haz actualizado con éxito tu contraseña!`;

    sendEmail(user.email, 'Actualización de contraseña', emailText);
}

const onCreateTask = (data) => {
    const emailText = `Hola ${data.username}, se te ha asignado una nueva tarea: ${data.title} con una fecha limite de ${data.due_date}`;

    sendEmail(data.email, 'Asignación de tarea', emailText);
}


eventEmitter.on('userRegistered', onRegisterUser);
eventEmitter.on('emailUpdate', onUserUpdateEmail);
eventEmitter.on('passwordUpdate', onUserUpdatePassword);
eventEmitter.on('assignedTask', onCreateTask);

module.exports = eventEmitter;
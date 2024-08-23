const os = require('node:os');
const { sendEmail } = require('./email-service-config');
const { getUsersByRole } = require('../src/tasks/tasks-repository');

exports.monitorSystemResources = async () => {
    const freeMemory = os.freemem() / os.totalmem();
    const loadAverage = os.loadavg()[0];

    if (freeMemory < 0.2) {
        const adminUsers = await getUsersByRole('admin');
        adminUsers.map(admin => {
            const to = admin.email;
            const subject = 'Poca memoria disponible en el servidor';
            const text = `Hola ${admin.username}, hemos detectado una baja cantidad de memoria disponible`;

            sendEmail(to, subject, text);
        });
    }

    if (loadAverage > os.cpus().length) {
        const adminUsers = await getUsersByRole('admin');
        adminUsers.map(admin => {
            const to = admin.email;
            const subject = 'Carga promedio superior al número de núcleos disponibles';
            const text = `Hola ${admin.username}, hemos detectado una carga superior al número de núcleos disponibles`;

            sendEmail(to, subject, text);
        });
    }
}
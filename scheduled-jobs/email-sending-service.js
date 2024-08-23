const fs = require('node:fs');
const cron = require('node-cron');
const PDFDocument = require('pdfkit-table');
const tasksRepository = require('../src/tasks/tasks-repository');
const { formatRows } = require('./utils');
const { monitorSystemResources } = require('./monitoring');
const { emailQueue } = require('./email-service-config');

//TODO: cambiar cron por 0 9 * * *
cron.schedule('0 9 * * *', async () => {
    const notCompletedTasks = await tasksRepository.getNotCompletedTasksAndUserInfo();

    if (notCompletedTasks.length) {
        notCompletedTasks.forEach(task => {
            const currentDate = new Date();
            const dueDate = new Date(task.due_date);
            const oneDayInMiliseconds = 86400000;
            const isLessThanOneDayLeftUntilDueDate = dueDate - currentDate <= oneDayInMiliseconds

            if (isLessThanOneDayLeftUntilDueDate) {
                const email = task.email;
                const username = task.username;
                const taskTitle = task.task_title;
                const data = {
                    to: email, 
                    subject: 'El tiempo limite de tu tarea asignada esta por vencer',
                    text: `Hola ${username}, tu tarea: ${taskTitle}, esta por vencer`
                }
                const options = {
                    attempts: 3
                }
                emailQueue.add(data, options);
            }
        });
    }
});

cron.schedule('*/5 * * * *', async () => {
    await monitorSystemResources();
});

// cron.schedule('9 20 * * *', async () => {
//     let doc = new PDFDocument({ margin: 30, size: 'A4' });
//     doc.pipe(fs.createWriteStream("./document.pdf"));
//     const adminUsers = await tasksRepository.getUsersByRole('admin');
//     const databaseReportInfo = await tasksRepository.getAdminDailyTasksReport();
//     if (databaseReportInfo.length) {
//         const table = {
//             title: 'Informe diario',
//             subtitle: 'Subtitle',
//             headers: Object.keys(databaseReportInfo[0]),
//             rows: formatRows(databaseReportInfo)
//         };
        
//         await doc.table(table, {
//             width: 1000,
//         });
//         await doc.table(table, { 
//             columnsSize: databaseReportInfo.map(data => 100),
//         });
//         doc.pipe(transporter)
//         doc.end();
//     }

//     adminUsers.forEach(admin => {
//         const data = {
//             to: 'ricardo.cr9rm@gmail.com', 
//             subject: 'Informe diario de tareas',
//             text: `Hola ${admin.username}, aquí está su informe diario con el detalle de tareas realizadas`,
//             attachments: [
//                 {
//                     filename: 'informe.pdf',
//                     content: fs.createReadStream('../document.pdf')
//                 }
//             ]
//         }
//         const options = {
//             attempts: 3
//         }
//         emailQueue.add(data, options);
//     });
// });
require('dotenv');
const Redis = require('ioredis');
const redis = new Redis();
const Queue = require('bull');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { getNotCompletedTasksAndUserInfo } = require('../src/tasks/tasks-repository');

const emailQueue = new Queue('emailQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.PROJECT_EMAIL,
        pass: process.env.PROJECT_EMAIL_PASSWORD
    }
});

emailQueue.process(async (job, done) => {
    const { to, subject, text } = job.data;

    const emailOptions = {
        from: process.env.PROJECT_EMAIL,
        to,
        subject,
        text
    }
    await transporter.sendMail(emailOptions);
    done(null, { message: "Email sent" });
});

exports.sendEmail = (to, subject, text) => {
    emailQueue.add({
        to,
        subject,
        text
    });
}

//TODO: cambiar cron por 0 9 * * *
cron.schedule('0 9 * * *', async () => {
    const notCompletedTasks = await getNotCompletedTasksAndUserInfo();

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

emailQueue.on("error", async (jobId, result) => {
    console.log(jobId, result)
});
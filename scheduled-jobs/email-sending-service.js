require('dotenv');
const Redis = require('ioredis');
const redis = new Redis();
const Queue = require('bull');
const nodemailer = require('nodemailer');

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

emailQueue.on("error", async (jobId, result) => {
    console.log(jobId, result)
});
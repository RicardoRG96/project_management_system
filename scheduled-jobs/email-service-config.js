require('dotenv');
const Redis = require('ioredis');
const redis = new Redis();
const Queue = require('bull');
const nodemailer = require('nodemailer');

exports.emailQueue = new Queue('emailQueue', {
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

this.emailQueue.process(async (job, done) => {
    const { to, subject, text, attachments } = job.data;

    const emailOptions = {
        from: process.env.PROJECT_EMAIL,
        to,
        subject,
        text
        // attachments
    }
    await transporter.sendMail(emailOptions);
    done(null, { message: "Email sent" });
});

exports.sendEmail = (to, subject, text) => {
    this.emailQueue.add({
        to,
        subject,
        text
        // attachments: []
    });
}

this.emailQueue.on("error", async (jobId, result) => {
    console.log(jobId, result)
});
import nodemailer from 'nodemailer';
import { ENV_EMAIL_GOOGLE_NODEMAILER, ENV_PASSWORD_GOOGLE_NODEMAILER } from './enviroments';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENV_EMAIL_GOOGLE_NODEMAILER,
        pass: ENV_PASSWORD_GOOGLE_NODEMAILER,
    }
});


export const sendEmail = async (mailOptions:any) => {
    return await transporter.sendMail(mailOptions);
};  
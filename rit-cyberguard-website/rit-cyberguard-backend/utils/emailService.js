const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
    // For production, use a proper email service like Gmail, SendGrid, or AWS SES
    if (process.env.NODE_ENV === 'production') {
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // For development, use Ethereal Email (creates temporary accounts)
        return nodemailer.createTestAccount().then(testAccount => {
            return nodemailer.createTransporter({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
        });
    }
};

// Send email function
const sendEmail = async ({ to, subject, text, html, replyTo }) => {
    try {
        let transporter;

        if (process.env.NODE_ENV === 'production') {
            transporter = createTransporter();
        } else {
            transporter = await createTransporter();
        }

        const mailOptions = {
            from: `"RIT CyberGuard" <${process.env.EMAIL_USER || 'noreply@ritcyberguard.com'}>`,
            to,
            subject,
            text,
            html,
            replyTo: replyTo || process.env.EMAIL_USER
        };

        const result = await transporter.sendMail(mailOptions);

        if (process.env.NODE_ENV !== 'production') {
            console.log('📧 Email sent successfully!');
            console.log('Preview URL:', nodemailer.getTestMessageUrl(result));
        } else {
            console.log('📧 Email sent successfully to:', to);
        }

        return result;

    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
};

// Email templates
const emailTemplates = {
    welcome: (name, details) => ({
        subject: 'Welcome to RIT CyberGuard!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #F76902;">Welcome to RIT CyberGuard!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for your interest in joining our cybersecurity community.</p>
                ${details}
                <p style="margin-top: 30px;">
                    <strong>Security Through Innovation</strong><br>
                    RIT CyberGuard Team
                </p>
            </div>
        `
    }),

    notification: (title, message) => ({
        subject: title,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00B4D8;">${title}</h2>
                ${message}
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                    This is an automated message from RIT CyberGuard.
                </p>
            </div>
        `
    })
};

module.exports = {
    sendEmail,
    emailTemplates
};
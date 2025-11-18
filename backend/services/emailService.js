const nodemailer = require('nodemailer');

// Mock transporter for development
const transporter = {
    sendMail: async (mailOptions) => {
        console.log('📧 Mock Email Sent:', {
            to: mailOptions.to,
            subject: mailOptions.subject
        });
        return { messageId: 'mock-message-id' };
    }
};

module.exports.sendCredentials = async (email, volunteerId, tempPassword, name) => {
    console.log(`📧 Would send credentials to ${email}: Volunteer ID: ${volunteerId}, Temp Password: ${tempPassword}`);
    
    const mailOptions = {
        from: `"NSS Club" <noreply@nssclub.com>`,
        to: email,
        subject: 'Welcome to NSS Club - Your Volunteer Credentials',
        text: `Welcome ${name}! Your Volunteer ID: ${volunteerId}, Temporary Password: ${tempPassword}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Mock credentials email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports.sendPasswordReset = async (email, resetToken, name) => {
    console.log(`📧 Would send password reset to ${email} with token: ${resetToken}`);
    
    const mailOptions = {
        from: `"NSS Club" <noreply@nssclub.com>`,
        to: email,
        subject: 'Password Reset Request - NSS Club',
        text: `Hello ${name}! Reset your password using this token: ${resetToken}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Mock password reset email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending reset email:', error);
        return false;
    }
};
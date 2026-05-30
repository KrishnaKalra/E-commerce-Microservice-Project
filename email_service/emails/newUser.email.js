const createNewUserMail = (to) => {
    const message = {
        to: to, 
        from: 'kalrakrishna26@gmail.com', 
        subject: 'Welcome to our platform! 🚀',
        text: 'Welcome aboard! We are excited to have you. Please visit your dashboard to get started.',
        html: `
            <div style="background-color: #f4f7f6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    
                    <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Welcome Aboard! 🎉</h1>
                    
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Hi there,
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        We are thrilled to welcome you to our platform. Your account has been successfully created, and you're now ready to explore everything we have to offer.
                    </p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://yourwebsite.com/login" style="background-color: #0066cc; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                            Log in to your Dashboard
                        </a>
                    </div>
                    
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 10px;">
                        If you have any questions, just reply to this email. We're always here to help.
                    </p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-top: 30px;">
                        Best regards,<br>
                        <strong>The Team</strong>
                    </p>

                    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                    <p style="color: #999999; font-size: 12px; text-align: center; line-height: 1.4;">
                        You are receiving this email because you recently created an account on our platform.<br>
                        &copy; 2026 Your Company Name. All rights reserved.
                    </p>

                </div>
            </div>
        ` 
    };

    return message;
};

export { createNewUserMail };
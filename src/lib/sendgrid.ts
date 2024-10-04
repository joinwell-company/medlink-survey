import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL || !process.env.NEXT_PUBLIC_BASE_URL) {
  console.error('Missing required environment variables for SendGrid');
  throw new Error('Missing required environment variables for SendGrid');
}

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define the email template as a separate function for better organization
function getEmailTemplate(name: string): string {
  // Use the public URL for the logo image
  const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Medlink Logo" style="max-width: 200px;">
      </div>
      
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin-bottom: 20px;">
        <h1 style="font-size: 24px; color: #333333; margin: 0;">
          <strong>Thank you. We'll be in touch soon!</strong>
        </h1>
      </div>

      <div style="color: #333333; line-height: 1.6;">
        <p>Hi ${name},</p>

        <p>Thank you for taking the time to complete our follow-up survey. Your responses will help us tailor the best healthcare solutions for you.</p>

        <p>One of our specialists will be in touch to help unlock your $100 Health Rebate. We're committed to supporting your health and financial well-being, and we're here to make healthcare more accessible for you.</p>

        <p>We look forward to speaking with you soon!</p>

        <p>Best regards,<br>The Medlink Team</p>
      </div>

      <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666666;">
        <p>&copy; ${new Date().getFullYear()} Medlink. All rights reserved.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms" style="color: #666666; text-decoration: underline;">Terms & Conditions</a> | 
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy" style="color: #666666; text-decoration: underline;">Privacy Policy</a> | 
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact" style="color: #666666; text-decoration: underline;">Contact Us</a>
        </p>
      </div>
    </div>
  `;
}

export async function sendConfirmationEmail(to: string, name: string): Promise<void> {
  try {
    const msg = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL as string,
        name: 'Medlink Team'
      },
      subject: 'Thank you for completing the Medlink Survey',
      html: getEmailTemplate(name),
    };

    const response = await sgMail.send(msg);
    console.log('Email sent successfully', response);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error instanceof Error && 'response' in error) {
      console.error(error);
    }
    throw new Error('Failed to send confirmation email: ' + (error as Error).message || 'Unknown error');
  }
}

export async function sendTestEmail(to: string): Promise<void> {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL as string,
      subject: 'Test Email',
      text: 'This is a test email from Medlink Survey',
    };

    const response = await sgMail.send(msg);
    console.log('Test email sent successfully', response);
  } catch (error) {
    console.error('Error sending test email:', error);
    if (error instanceof Error && 'response' in error) {
      console.error(error);
    }
    throw new Error('Failed to send test email: ' + (error as Error).message || 'Unknown error');
  }
}
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
  console.error('Missing required environment variables for SendGrid');
  throw new Error('Missing required environment variables for SendGrid');
}

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendConfirmationEmail(to: string, fullName: string): Promise<void> {
  try {
    const names = fullName.split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names[names.length - 1] : '';

    const msg: sgMail.MailDataRequired = {
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL as string,
        name: 'Medlink Team'
      },
      templateId: 'd-33dcfbeecdf24280858f16dc6c4f20c9',
      dynamicTemplateData: {
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        current_year: new Date().getFullYear(),
      },
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

// Keep the sendTestEmail function as is
// export async function sendTestEmail(to: string): Promise<void> {
//   try {
//     const msg: sgMail.MailDataRequired = {
//       to,
//       from: process.env.SENDGRID_FROM_EMAIL as string,
//       subject: 'Test Email',
//       text: 'This is a test email from Medlink Survey',
//     };

//     const response = await sgMail.send(msg);
//     console.log('Test email sent successfully', response);
//   } catch (error) {
//     console.error('Error sending test email:', error);
//     if (error instanceof Error && 'response' in error) {
//       const responseError = error as any;
//       console.error('SendGrid API response:', responseError.response?.body);
//     }
//     throw new Error('Failed to send test email: ' + (error as Error).message || 'Unknown error');
//   }
// }
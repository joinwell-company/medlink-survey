import { NextRequest, NextResponse } from 'next/server';
import { sendConfirmationEmail } from '@/lib/sendgrid';

export async function GET(request: NextRequest) {
  try {
    const testEmail = 'zakarya45@gmail.com' ;
    const testName = 'Zakarya Guerinat';

    await sendConfirmationEmail(testEmail, testName);

    return NextResponse.json({ message: 'Test email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
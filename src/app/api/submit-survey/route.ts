import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';
import prisma from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/sendgrid';
import { applyRateLimit } from '@/lib/rateLimit';

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_URL = 'https://api.pipedrive.com/v1';

async function sendToPipedrive(surveyData: any) {
  try {
    // Create a person in Pipedrive (keep this part as is)
    const personData = {
      name: surveyData.name,
      email: [{ value: surveyData.email, primary: true }],
      phone: [{ value: surveyData.phoneNumber, primary: true }],
    };

    const personResponse = await axios.post(
      `${PIPEDRIVE_API_URL}/persons?api_token=${PIPEDRIVE_API_TOKEN}`,
      personData
    );

    console.log('Person created in Pipedrive:', personResponse.data);

    const personId = personResponse.data.data.id;

    // Create a lead in Pipedrive with basic information
    const leadData = {
      title: `New Survey: ${surveyData.name}`,
      person_id: personId,
    };

    const leadResponse = await axios.post(
      `${PIPEDRIVE_API_URL}/leads?api_token=${PIPEDRIVE_API_TOKEN}`,
      leadData
    );

    console.log('Lead created in Pipedrive:', leadResponse.data);

    const leadId = leadResponse.data.data.id;

    // Create a note with the survey data
    const noteContent = `
      Survey Data:
      - Date of Birth: ${surveyData.dateOfBirth}
      - Primary Investment Goals: ${surveyData.primaryInvestmentGoals.join(', ')}
      - Secondary Investment Goals: ${surveyData.secondaryInvestmentGoals.join(', ')}
      - Financial Wellbeing: $${surveyData.financialWellbeing}
      - Savings in 12 months: $${surveyData.hasSavings}
      - Current Superannuation: $${surveyData.monthlySavings}
      - Preferred Contact Time: ${surveyData.preferredTime}
      - Preferred Contact Day: ${surveyData.preferredDay}
      - Additional Info: ${surveyData.additionalInfo || 'None provided'}
    `;

    const noteData = {
      content: noteContent,
      lead_id: leadId,
    };

    const noteResponse = await axios.post(
      `${PIPEDRIVE_API_URL}/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
      noteData
    );

    console.log('Note added to lead in Pipedrive:', noteResponse.data);

    console.log('Data sent to Pipedrive successfully');
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('Error sending data to Pipedrive:', error.response?.data || error.message);
    } else {
      console.error('Error sending data to Pipedrive:', error);
    }
    throw new Error('Failed to send data to Pipedrive');
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request);
  if (rateLimitResult) {
    return rateLimitResult;
  }

  // If we reach here, the rate limit was not exceeded
  try {
    // For testing purposes, you can use hardcoded data instead of parsing the request body
    const testData = {
      name: 'Test User',
      email: 'your-test-email@example.com',
      // ... (other required fields)
    };

    // Use testData instead of parsing request.json()
    // const body = await request.json();

    // ... (rest of the function using testData instead of body)

    // Send confirmation email
    await sendConfirmationEmail(testData.email, testData.name);

    return NextResponse.json({
      message: 'Survey submitted successfully and confirmation email sent',
      survey: testData,
    }, { status: 200 });
  } catch (error) {
    // ... (existing error handling)
  }
}

import { NextResponse } from 'next/server';
import axios from 'axios';
import { AxiosError } from 'axios';
import prisma from '@/lib/prisma';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      dateOfBirth,
      primaryInvestmentGoals,
      secondaryInvestmentGoals,
      financialWellbeing,
      hasSavings,
      monthlySavings,
      preferredTime,
      preferredDay,
      phoneNumber,
      additionalInfo,
    } = body;

    // Validate required fields
    const requiredFields = [
      'name',
      'email',
      'dateOfBirth',
      'financialWellbeing',
      'hasSavings',
      'preferredTime',
      'preferredDay',
      'phoneNumber',
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // Validate and parse date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return NextResponse.json({ message: 'Invalid date of birth' }, { status: 400 });
    }
    // Format date to YYYY-MM-DD for Pipedrive
    const formattedDob = dob.toISOString().split('T')[0];

    // Validate and parse numeric fields
    const parsedFinancialWellbeing = parseFloat(financialWellbeing);
    const parsedHasSavings = parseFloat(hasSavings);
    const parsedMonthlySavings = parseFloat(monthlySavings);

    if (
      isNaN(parsedFinancialWellbeing) ||
      isNaN(parsedHasSavings) ||
      (monthlySavings && isNaN(parsedMonthlySavings))
    ) {
      return NextResponse.json({ message: 'Invalid numeric values' }, { status: 400 });
    }

    const survey = await prisma.survey.create({
      data: {
        name,
        email,
        dateOfBirth: dob,
        primaryInvestmentGoals,
        secondaryInvestmentGoals,
        financialWellbeing: parsedFinancialWellbeing,
        hasSavings: parsedHasSavings,
        monthlySavings: parsedMonthlySavings,
        preferredTime,
        preferredDay,
        phoneNumber,
        additionalInfo,
      },
    });

    // Send data to Pipedrive
    await sendToPipedrive({
      ...survey,
      dateOfBirth: formattedDob, // Use formatted date
    });

    return NextResponse.json({
      message: 'Survey submitted successfully and sent to Pipedrive',
      survey,
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing survey:', error);
    if (error instanceof AxiosError && error.response) {
      console.error('Pipedrive API error:', error.response.data);
      console.error('Pipedrive API status:', error.response.status);
      console.error('Pipedrive API headers:', error.response.headers);
    } else {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json({
      message: 'Error processing survey',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }, { status: 500 });
  }
}

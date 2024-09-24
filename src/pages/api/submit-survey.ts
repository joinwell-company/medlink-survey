import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { AxiosError } from 'axios';

const prisma = new PrismaClient();

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const PIPEDRIVE_API_URL = 'https://api.pipedrive.com/v1';

async function sendToPipedrive(surveyData: any) {
  try {
    // Create a person in Pipedrive with only standard fields
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

    // Create a lead in Pipedrive, associating the person, and include custom fields
    const leadData = {
      title: `New Survey: ${surveyData.name}`,
      person_id: personId,
      // Add custom fields here. Make sure to replace these with your actual custom field keys
      'bfb78c07b9bb730d195d6b46043f665434bc1b44': surveyData.dateOfBirth,
      'ceab9c4ada84eccf7958b97635454329d8ac0c9e': surveyData.primaryInvestmentGoals.join(', '),
      'e8b1aa3141fe988eb38d3faf0d07d1b70b5e701c': surveyData.secondaryInvestmentGoals.join(', '),
      'b2073baf491b560b669862ec6a060b2974e61142': surveyData.financialWellbeing,
      'b720b37dd84a14f6d05c7901c7846f24da27eb83': surveyData.hasSavings,
      '57b330b9575159e26278cd0dbdd7d68712c0139c': surveyData.monthlySavings,
      '4b8497b4b8d35e96ede02577cf8f7247c87255cf': surveyData.preferredTime,
      '54a01454a5cc706e33fdee7055e714a5644d82fa': surveyData.preferredDay,
      '0894b691b7862ba947259da949780d0e14531f38': surveyData.additionalInfo,
    };

    const leadResponse = await axios.post(
      `${PIPEDRIVE_API_URL}/leads?api_token=${PIPEDRIVE_API_TOKEN}`,
      leadData
    );

    console.log('Lead created in Pipedrive:', leadResponse.data);

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
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
    } = req.body;

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
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validate and parse date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth' });
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
      return res.status(400).json({ message: 'Invalid numeric values' });
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

    res.status(200).json({
      message: 'Survey submitted successfully and sent to Pipedrive',
      survey,
    });
  } catch (error) {
    console.error('Error processing survey:', error);
    if (error instanceof AxiosError && error.response) {
      console.error('Pipedrive API error:', error.response.data);
      console.error('Pipedrive API status:', error.response.status);
      console.error('Pipedrive API headers:', error.response.headers);
    } else {
      console.error('Unexpected error:', error);
    }
    res.status(500).json({
      message: 'Error processing survey',
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      phoneNumber,
      additionalInfo
    } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'dateOfBirth', 'financialWellbeing', 'hasSavings', 'preferredTime', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Validate and parse date of birth
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth' });
    }

    // Validate and parse financial wellbeing
    const parsedFinancialWellbeing = parseFloat(financialWellbeing);
    if (isNaN(parsedFinancialWellbeing)) {
      return res.status(400).json({ message: 'Invalid financial wellbeing amount' });
    }

    // Validate and parse has savings
    const parsedHasSavings = parseFloat(hasSavings);
    if (isNaN(parsedHasSavings)) {
      return res.status(400).json({ message: 'Invalid has savings amount' });
    }

    // Validate and parse monthly savings
    const parsedMonthlySavings = parseFloat(monthlySavings);
    if (isNaN(parsedMonthlySavings)) {
      return res.status(400).json({ message: 'Invalid monthly savings amount' });
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
        phoneNumber,
        additionalInfo
      },
    });

    res.status(200).json({ message: 'Survey submitted successfully', survey });
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).json({ message: 'Error submitting survey', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendConfirmationEmail } from '@/lib/sendgrid';
import { applyRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await applyRateLimit(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const surveyData = await request.json();

    // Save survey data to database
    const savedSurvey = await prisma.survey.create({
      data: surveyData,
    });

    // Send confirmation email
    await sendConfirmationEmail(surveyData.email, surveyData.name);

    return NextResponse.json({ message: 'Survey submitted successfully', survey: savedSurvey });
  } catch (error) {
    console.error('Error submitting survey:', error);
    return NextResponse.json({ error: 'Failed to submit survey' }, { status: 500 });
  }
}

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "primaryInvestmentGoals" TEXT[],
    "secondaryInvestmentGoals" TEXT[],
    "financialWellbeing" TEXT NOT NULL,
    "hasSavings" TEXT NOT NULL,
    "monthlySavings" DOUBLE PRECISION NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

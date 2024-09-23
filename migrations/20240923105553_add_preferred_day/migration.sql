-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "primaryInvestmentGoals" TEXT[],
    "secondaryInvestmentGoals" TEXT[],
    "monthlySavings" DOUBLE PRECISION NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "preferredDay" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "additionalInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "financialWellbeing" DOUBLE PRECISION NOT NULL,
    "hasSavings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

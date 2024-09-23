-- Step 1: Add new columns
ALTER TABLE "Survey" ADD COLUMN "financialWellbeing_new" FLOAT;
ALTER TABLE "Survey" ADD COLUMN "hasSavings_new" FLOAT;

-- Step 2: Copy data from old columns to new columns, converting to float
UPDATE "Survey"
SET "financialWellbeing_new" = CAST("financialWellbeing" AS FLOAT),
    "hasSavings_new" = CAST("hasSavings" AS FLOAT);

-- Step 3: Drop old columns
ALTER TABLE "Survey" DROP COLUMN "financialWellbeing";
ALTER TABLE "Survey" DROP COLUMN "hasSavings";

-- Step 4: Rename new columns to original names
ALTER TABLE "Survey" RENAME COLUMN "financialWellbeing_new" TO "financialWellbeing";
ALTER TABLE "Survey" RENAME COLUMN "hasSavings_new" TO "hasSavings";

-- Step 5: Add NOT NULL constraint to new columns
ALTER TABLE "Survey" ALTER COLUMN "financialWellbeing" SET NOT NULL;
ALTER TABLE "Survey" ALTER COLUMN "hasSavings" SET NOT NULL;
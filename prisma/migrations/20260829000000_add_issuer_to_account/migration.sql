-- Better Auth v1.7+ scopes account identity by issuer. Add the required column,
-- backfill existing Google OAuth rows, then remove the temporary default.
-- AlterTable
ALTER TABLE "account" ADD COLUMN "issuer" TEXT NOT NULL DEFAULT '';

-- Backfill existing OAuth accounts (only google is configured)
UPDATE "account" SET "issuer" = 'https://accounts.google.com' WHERE "providerId" = 'google';

-- Drop the temporary default so the schema matches Better Auth's required String
ALTER TABLE "account" ALTER COLUMN "issuer" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "account_issuer_accountId_key" ON "account"("issuer", "accountId");

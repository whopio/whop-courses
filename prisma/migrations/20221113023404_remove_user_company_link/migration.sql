/*
  Warnings:

  - You are about to drop the column `route` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `CompanyUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CompanyUser" DROP CONSTRAINT "CompanyUser_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyUser" DROP CONSTRAINT "CompanyUser_userId_fkey";

-- DropIndex
DROP INDEX "Company_route_key";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "route";

-- DropTable
DROP TABLE "CompanyUser";

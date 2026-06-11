-- CreateEnum
CREATE TYPE "Category" AS ENUM ('IT_PROGRAMMING', 'DESIGN_MULTIMEDIA', 'WRITING_TRANSLATION', 'SALES_MARKETING', 'FINANCE_MANAGEMENT', 'LEGAL', 'ADMIN_SUPPORT', 'ENGINEERING');

-- CreateEnum
CREATE TYPE "BudgetType" AS ENUM ('FIXED', 'HOURLY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "budgetType" "BudgetType" NOT NULL DEFAULT 'FIXED',
    "status" "ProjectStatus" NOT NULL DEFAULT 'OPEN',
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

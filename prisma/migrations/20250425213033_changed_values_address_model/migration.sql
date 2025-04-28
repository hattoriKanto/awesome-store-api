/*
  Warnings:

  - Made the column `latitude` on table `adresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `longitude` on table `adresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "adresses" ALTER COLUMN "label" DROP NOT NULL,
ALTER COLUMN "latitude" SET NOT NULL,
ALTER COLUMN "longitude" SET NOT NULL;

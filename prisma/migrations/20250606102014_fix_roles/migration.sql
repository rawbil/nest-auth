/*
  Warnings:

  - The values [CLIENT,CUSTOMER] on the enum `Users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';

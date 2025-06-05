/*
  Warnings:

  - You are about to alter the column `role` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `role` ENUM('USER', 'CLIENT', 'CUSTOMER') NOT NULL DEFAULT 'USER';

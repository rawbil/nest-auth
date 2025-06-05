-- AlterTable
ALTER TABLE `Users` ADD COLUMN `role` ENUM('user', 'client', 'customer') NOT NULL DEFAULT 'user';

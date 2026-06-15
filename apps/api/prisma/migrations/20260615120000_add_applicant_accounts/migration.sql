-- AlterTable
ALTER TABLE `job_applications` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `authProvider` ENUM('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL',
    ADD COLUMN `avatarUrl` VARCHAR(191) NULL,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `googleId` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `otpCode` VARCHAR(191) NULL,
    ADD COLUMN `otpExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `role` ENUM('SUPER_ADMIN', 'ADMIN', 'HR', 'APPLICANT') NOT NULL DEFAULT 'HR';

-- CreateTable
CREATE TABLE `user_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `category` ENUM('RESUME', 'PORTFOLIO', 'CERTIFICATE', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `fileName` VARCHAR(191) NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileType` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_documents_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `job_applications_userId_idx` ON `job_applications`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `users_googleId_key` ON `users`(`googleId`);

-- AddForeignKey
ALTER TABLE `user_documents` ADD CONSTRAINT `user_documents_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `job_applications` ADD CONSTRAINT `job_applications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- CreateEnum
CREATE TYPE "UserBadge" AS ENUM ('PREMIUM', 'MATURE', 'NOT_SAFE', 'SAFE', 'TRUSTED', 'MODERATOR', 'ADMINISTRATOR', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "PremiumFeature" AS ENUM ('CUSTOM_PROFILE', 'UNLIMITED_UPLOADS');

-- CreateEnum
CREATE TYPE "SafetyRating" AS ENUM ('TRUSTED', 'SAFE', 'UNKNOWN', 'NOT_SAFE', 'MATURE');

-- CreateEnum
CREATE TYPE "LockingStatus" AS ENUM ('LOCKED', 'HIDDEN', 'NONE');

-- CreateEnum
CREATE TYPE "UserConnectionType" AS ENUM ('EMAIL', 'GOOGLE', 'DISCORD', 'TWITTER', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "GroupMemberRole" AS ENUM ('NONE', 'ADMINISTRATOR', 'OWNER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('NONE', 'MATURE', 'NOT_SAFE', 'SAFE', 'TRUSTED', 'MODERATOR', 'ADMINISTRATOR', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('MATURE', 'SPAM', 'VIOLENCE', 'HARASSMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('RANDOM_INFO', 'NEW_FAVOURITE', 'NEW_FOLLOWER', 'SUBSCRIPTION_ACTIVE', 'SUBSCRIPTION_EXPIRING_SOON', 'SUBSCRIPTION_EXPIRED', 'USER_MARKED_AS_MATURE_BY_MODERATOR', 'USER_MARKED_AS_NOT_MATURE_BY_MODERATOR', 'USER_MARKED_AS_TRUSTED_BY_MODERATOR', 'USER_MARKED_AS_NOT_TRUSTED_BY_MODERATOR', 'ALBUM_LOCKED_BY_MODERATOR', 'ALBUM_UNLOCKED_BY_MODERATOR', 'ALBUM_DELETED_BY_MODERATOR', 'IMAGE_LOCKED_BY_MODERATOR', 'IMAGE_UNLOCKED_BY_MODERATOR', 'IMAGE_DELETED_BY_MODERATOR', 'NEW_GROUP_INVITE', 'GROUP_MEMBER_JOINED', 'GROUP_MEMBER_LEFT', 'GROUP_MEMBER_INVITE_ACCEPTED', 'GROUP_MEMBER_INVITE_DECLINED', 'GROUP_MEMBER_INVITE_EXPIRED');

-- CreateEnum
CREATE TYPE "ModeratorNotificationsType" AS ENUM ('NEW_REPORT', 'SUSPICIOUS_ACTIVITY');

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "id" TEXT NOT NULL,
    "role" "GroupMemberRole" NOT NULL DEFAULT E'NONE',
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "nickname" TEXT,
    "bio" TEXT,
    "role" "UserRole" NOT NULL DEFAULT E'NONE',
    "permissions" INTEGER NOT NULL DEFAULT 130048,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "avatarUrl" TEXT,
    "avatarSourceId" TEXT,
    "bannerExt" TEXT NOT NULL DEFAULT E'png',
    "badges" "UserBadge"[],
    "lockStatus" "LockingStatus" NOT NULL DEFAULT E'NONE',
    "premiumFeatures" "PremiumFeature"[],
    "userFavouriteIds" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserConnection" (
    "id" TEXT NOT NULL,
    "type" "UserConnectionType" NOT NULL,
    "email" TEXT NOT NULL,
    "handle" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,
    "userId" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "slug" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "albumId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "lockStatus" "LockingStatus" NOT NULL DEFAULT E'NONE',
    "rating" "SafetyRating" NOT NULL DEFAULT E'UNKNOWN',

    CONSTRAINT "Category_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageExt" TEXT NOT NULL,
    "colors" INTEGER[],
    "title" TEXT,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "groupId" TEXT,
    "albumId" TEXT NOT NULL,
    "lockStatus" "LockingStatus" NOT NULL DEFAULT E'NONE',
    "rating" "SafetyRating" NOT NULL DEFAULT E'UNKNOWN',
    "userFavouriteIds" TEXT[],

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverExt" TEXT NOT NULL,
    "colors" INTEGER[],
    "title" TEXT,
    "description" TEXT,
    "authorId" TEXT NOT NULL,
    "groupId" TEXT,
    "lockStatus" "LockingStatus" NOT NULL DEFAULT E'NONE',
    "rating" "SafetyRating" NOT NULL DEFAULT E'UNKNOWN',
    "userFavouriteIds" TEXT[],

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "albumId" TEXT,
    "imageId" TEXT,
    "userId" TEXT,
    "reporteeId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeratorNotifications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "ModeratorNotificationsType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "ModeratorNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFavouriteUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFavouriteImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UserFavouriteAlbums" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Group_id_key" ON "Group"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_id_key" ON "GroupMember"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_groupId_userId_key" ON "GroupMember"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserConnection_email_type_key" ON "UserConnection"("email", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Session_handle_key" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_hashedToken_type_key" ON "Token"("hashedToken", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_albumId_imageId_idx" ON "Category"("albumId", "imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_id_key" ON "Image"("id");

-- CreateIndex
CREATE INDEX "Image_id_authorId_idx" ON "Image"("id", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Album_id_key" ON "Album"("id");

-- CreateIndex
CREATE INDEX "Album_id_authorId_idx" ON "Album"("id", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE INDEX "Report_albumId_imageId_userId_idx" ON "Report"("albumId", "imageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavouriteUsers_AB_unique" ON "_UserFavouriteUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavouriteUsers_B_index" ON "_UserFavouriteUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavouriteImages_AB_unique" ON "_UserFavouriteImages"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavouriteImages_B_index" ON "_UserFavouriteImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFavouriteAlbums_AB_unique" ON "_UserFavouriteAlbums"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFavouriteAlbums_B_index" ON "_UserFavouriteAlbums"("B");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserConnection" ADD CONSTRAINT "UserConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporteeId_fkey" FOREIGN KEY ("reporteeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeratorNotifications" ADD CONSTRAINT "ModeratorNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteUsers" ADD FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteUsers" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteImages" ADD FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteImages" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteAlbums" ADD FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFavouriteAlbums" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

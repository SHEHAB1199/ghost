import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import {Role} from '@prisma/client';
@Injectable()
export class PoliceService {
  constructor(private prisma: DataBaseService) {}

  // Get all police users
  async getPoliceUsers() {
    return this.prisma.police.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        badgeNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get a single police user by ID
  async getPoliceUserById(policeId: string) {
    const police = await this.prisma.police.findUnique({
      where: { id: policeId },
      select: {
        id: true,
        image: true,
        cover: true,
        username: true,
        name: true,
        badgeNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!police) {
      throw new NotFoundException(`Police user with ID ${policeId} not found`);
    }

    return police;
  }
  async promoteUserToPolice(userId: string) {
    // Check if the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // if (user.role === Role.POLICE) {
    //   throw new ConflictException(`User with ID ${userId} is already a police user`);
    // }

    // Update the user's role to POLICE
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role: Role.POLICE },
    });

    // Create a corresponding entry in the Police model
    const policeUser = await this.prisma.police.create({
      data: {
        id: userId, // Use the same ID as the user
        username: user.username,
        phoneNumber: user.phoneNumber,
        name: user.name,
        badgeNumber: `BADGE-${Date.now()}`, // Generate a unique badge number
      },
    });

    return {
      user: updatedUser,
      police: policeUser,
    };
  }
  // Ban a user
  async banUser(userId: string, policeId: string, reason?: string) {
    // Check if the police user exists
    const police = await this.prisma.police.findUnique({ where: { id: policeId } });
    if (!police) {
      throw new NotFoundException(`Police user with ID ${policeId} not found`);
    }

    // Check if the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Ban the user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    });

    // Create a record in the BannedUser model
    await this.prisma.bannedUser.create({
      data: {
        userId,
        bannedById: policeId,
        reason,
      },
    });

    return updatedUser;
  }

  // Unban a user
  async unbanUser(userId: string, policeId: string) {
    // Check if the police user exists
    const police = await this.prisma.police.findUnique({ where: { id: policeId } });
    if (!police) {
      throw new NotFoundException(`Police user with ID ${policeId} not found`);
    }

    // Check if the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Unban the user
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isBanned: false },
    });

    // Update the unbannedAt field in the BannedUser model
    await this.prisma.bannedUser.updateMany({
      where: { userId, unbannedAt: null },
      data: { unbannedAt: new Date() },
    });

    return updatedUser;
  }

  // View all reports
  async viewReports() {
    return this.prisma.report.findMany({
      include: {
        reportedBy: true,
        reportedUser: true,
        reviewedBy: true,
      },
    });
  }

  // View all banned users
  async viewBannedUsers() {
    return this.prisma.user.findMany({
      where: { isBanned: true },
      select: {
        id: true,
        username: true,
        name: true,
        phoneNumber: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
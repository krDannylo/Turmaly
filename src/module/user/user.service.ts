import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@prisma/client";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) {}

  async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { teacher: true, student: true },
    });

    if (!user) throw new NotFoundException('User not found');

    let profileId: number | null = null;
    if (user.role === UserRole.TEACHER && user.teacher) profileId = user.teacher.id;
    else if (user.role === UserRole.STUDENT && user.student) profileId = user.student.id;

    return {
      userId: user.id,
      role: user.role,
      profileId,
    };
  }
}
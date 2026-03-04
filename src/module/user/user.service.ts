import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@prisma/client";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserProfileDto } from "./dto/user-profile.dto";
import { HashingServiceProtocol } from "src/common/hash/hashing.service";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { MeProfileResponseDto } from "./dto/me-profile-response.dto";
import { UpdateMeResponseDto } from "./dto/update-me-response.dto";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private readonly hashingService: HashingServiceProtocol,
    ) {}

  async getUserProfile(userId: number): Promise<MeProfileResponseDto> {
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
      profileId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    };
  }

  async updateMe(profile: UserProfileDto, updateUserDto: UpdateUserDto): Promise<UpdateMeResponseDto>{
    const me = await this.getUserProfile(profile.userId)

    const updateDate: {
      name?: string
      email?: string
      phone?: string | null
    } = {
      name: updateUserDto.name ?? me.name,
      email: updateUserDto.email ?? me.email,
      phone: updateUserDto.phone ?? me.phone
    }

    const myProfile = await this.prisma.user.update({
      where: { id: profile.userId },
      data: updateDate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      }
    })

    return myProfile as UpdateMeResponseDto;
  }

  async updatePassword(profile: UserProfileDto, passwordDto: UpdatePasswordDto){
      const { password } = passwordDto;
      if(!password) throw new NotFoundException('Password Invalid');
      const me = await this.prisma.user.findFirst({
        where: { id: profile.userId }
      })

      const passwordHash = await this.hashingService.hash(password);
      const updatePassword = passwordHash ?? me?.password

      await this.prisma.user.update({
        where: { id: profile.userId },
        data: { password: updatePassword },
      })

      return "Password Updated";
  }
}
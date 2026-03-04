import { UserRole } from "@prisma/client";

export class MeProfileResponseDto {
  userId: number;
  profileId: number | null;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}

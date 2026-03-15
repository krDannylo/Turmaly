import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { SignInResponseDto } from "./dto/sign-in-response.dto";
import { SignUpResponseDto } from "./dto/sign-up-response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){ }

    @Post('signIn')
    signIn(@Body() signInDto: SignInDto): Promise<SignInResponseDto> {
        return this.authService.authenticate(signInDto);
    }

    @Post('signUp')
    signUp(@Body() signUpDto: SignUpDto): Promise<SignUpResponseDto> {
        return this.authService.register(signUpDto);
    }

    @Post('auth/refreshToken')
    refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }    

    @Get('verify-email')
    verifyEmail(@Query('token') token: string){
        return this.authService.validateEmail(token)
    }
}
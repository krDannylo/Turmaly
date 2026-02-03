import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){ }

    @Post('signIn')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.authenticate(signInDto)
    }

    @Post('signUp')
    signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.register(signUpDto)
    }
}
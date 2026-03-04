import { Controller, Get } from "@nestjs/common"
import { ChatService } from "./services/chat.service";

@Controller()
export class LlmController {
    constructor(
        private chatService: ChatService
    ){ }

    @Get('test-ai')
    async test(): Promise<any> {
        return this.chatService.handleMessage('');
    }
}
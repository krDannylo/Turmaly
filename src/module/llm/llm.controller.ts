import { Controller, Get } from "@nestjs/common"
import { ChatService } from "./services/chat.service";

@Controller()
export class LlmController {
    constructor(
        private chatService: ChatService
    ){ }

    @Get('test-ai')
    async test() {
        return await this.chatService.handleMessage(
            'Teve algum aviso importante relacionado a violão nesses dias?'
        )
    }
}
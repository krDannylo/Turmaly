import { Injectable } from "@nestjs/common";
import { LlmService } from "./llm.service";
import { PostService } from "src/module/post/post.service";
import { INTENT } from "../types/intent.types";
import { PinoLogger } from "nestjs-pino";

@Injectable()
export class ChatService {
  constructor(
    private llm: LlmService,
    private postService: PostService,
    private readonly logger: PinoLogger,
  ) {}

  async handleMessage(message: string) {
    const { intent, params, reason} = await this.llm.extractIntent(message);
    this.logger.info(`Intent: ${intent}`)
    this.logger.info(`Params: ${JSON.stringify(params)}`)
    this.logger.info(`Reason: ${reason}`)

    if (intent === INTENT.GET_ANNOUNCEMENTS) {
      const posts = await this.postService.findByParams(params);

      const postsFiltered = await this.llm.analyzePostsContent(message, posts);
      if (postsFiltered.found) {
        return await this.postService.findManyByPostId(postsFiltered.postIds)
      }

      return { message: 'Nenhuma publicação encontrada para essa pergunta.' }
    }

    return { message: 'Intent not supported' }
  }
}
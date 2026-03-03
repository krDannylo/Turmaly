import { Injectable } from "@nestjs/common";
import { LlmService } from "./llm.service";
import { PostService } from "src/module/post/post.service";
import { INTENT } from "../types/intent.types";

@Injectable()
export class ChatService {
  constructor(
    private llm: LlmService,
    private postService: PostService,
  ) {}

  private shouldAnalyzeContent(message: string) {
    const m = message.toLowerCase();
    return (
      m.includes("mencione") ||
      m.includes("mencionar") ||
      m.includes("menciona") ||
      m.includes("sobre ") ||
      m.includes("relacionad") ||
      m.includes("a respeito") ||
      m.includes("ligado") ||
      m.includes("que fale") ||
      m.includes("que trate") ||
      m.includes("assunto") ||
      m.includes("tema") ||
      m.includes("tópico") ||
      m.includes("topico")
    );
  }

  async handleMessage(message: string) {
    const { intent, params } = await this.llm.extractIntent(message);
    console.log(intent, params)
    if (intent === INTENT.GET_ANNOUNCEMENTS) {
      const posts = await this.postService.findByParams(params);

      if (!this.shouldAnalyzeContent(message)) {
        return posts;
      }

      const postsFiltered = await this.llm.analyzePostsContent(message, posts);
      if (postsFiltered.found) {
        return await this.postService.findManyByPostId(postsFiltered.postIds)
      }
      return { message: 'Nenhuma publicação encontrada para essa pergunta.' }
    }

    return { message: 'Intent not supported' }
  }
}
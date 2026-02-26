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

  async handleMessage(message: string) {
    const { intent, params } = await this.llm.extractIntent(message);
    console.log(intent, params)
    if (intent === INTENT.GET_ANNOUNCEMENTS_PUBLISHED) {
        return await this.postService.findByParams(params);
    }
    if(intent === INTENT.GET_ANNOUNCEMENTS_MENTIONED) {
        const posts = await this.postService.findByParams(params);
        const postsFiltered = await this.llm.analyzePostsContent(message, posts);

        if(postsFiltered.found){
            return await this.postService.findManyByPostId(postsFiltered.postIds)
        }
    }
    return { message: 'Intent not supported '}
  }
}
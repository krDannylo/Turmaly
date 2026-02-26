import OpenAI from "openai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { buildAnalyzePostsPrompt, buildUserPrompt } from "../prompts/user.classifier";
import { SYSTEM_CONTENT_ANALYZER, SYSTEM_INTENT_CLASSIFIER } from "../prompts/system.classifier";
import { LLM_DEFAULT_VALUE } from "src/common/values/llm.values";
import { IntentResponse } from "../interface/intent.interface";

@Injectable()
export class LlmService {
    private client: OpenAI

    constructor(
        config: ConfigService
    ){
        this.client = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') })
     }

     async extractIntent(message: string): Promise<IntentResponse>{
        const userPrompt = buildUserPrompt(message)

        const res = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.4,
            messages: [
                { role: 'system', content: SYSTEM_INTENT_CLASSIFIER},
                { role: 'user', content: userPrompt }
            ],
        })

        const raw = res.choices[0].message.content ?? JSON.stringify(LLM_DEFAULT_VALUE);
        try{
            const parsed = JSON.parse(raw);
            return {
                intent: typeof parsed.intent === 'string' ? parsed.intent : "UNKNOWN",
                params: parsed.params || {}
            } as IntentResponse;
        } catch(err){
            return LLM_DEFAULT_VALUE;
        }
     }

     async analyzePostsContent(message: string, posts: any[]): Promise<{found: boolean, postIds: []}>{
        // const formattedPosts = posts.map(post => ({
        //     id: post.id,
        //     title: post.title,
        //     content: post.content
        // }));

        const userPrompt = buildAnalyzePostsPrompt(message, posts)

        const res = await this.client.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.2,
            messages: [
                { role: 'system', content: SYSTEM_CONTENT_ANALYZER},
                { role: 'user', content: userPrompt }
            ],
        })

        const raw = res.choices[0].message.content ?? '{}'
        try {
            return JSON.parse(raw);
        } catch {
            return {
                found: false,
                postIds: [],
            };
        }
     }
}
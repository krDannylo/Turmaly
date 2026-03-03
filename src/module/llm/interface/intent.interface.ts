import { Intent } from "../types/intent.types"
import { ParamsResponse } from "../types/params.types"

export interface IntentResponse {
    intent: Intent
    params: ParamsResponse
    reason: string
}
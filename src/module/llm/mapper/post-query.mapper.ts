import { Prisma } from "@prisma/client";
import { ParamsResponse, PERIOD_VALUES } from "../types/params.types";
import { getDayRange } from "../utils/get-date-range.utils";

export function buildPostWhere(params: ParamsResponse): Prisma.PostWhereInput {
    const where: Prisma.PostWhereInput = {}
    
    if(params.date == 'yesterday'){
        const { start, end } = getDayRange(-1)
        where.createdAt = { gte: start, lt: end }
    }else if(params.date == 'today'){
        const { start, end } = getDayRange(0)
        where.createdAt = { gte: start, lt: end }
    }else if(params.date == 'tomorrow'){
        const { start, end } = getDayRange(1)
        where.createdAt = { gte: start, lt: end }
    }
    
    if(params.priority == true){
        where.priority = { equals: true }
    }

    return where
}
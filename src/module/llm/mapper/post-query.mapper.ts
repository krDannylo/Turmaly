import { Prisma } from "@prisma/client";
import { ParamsResponse } from "../types/params.types";
import { getDayRange, getDaysRange, getMonthRange, getWeekRange } from "../utils/get-params-range.utils";

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
    } else if(params.period){
        const days = params.days ?? 3;
        if(params.period == "last_month"){
            const { start, end } = getMonthRange(-1)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "this_month"){
            const { start, end } = getMonthRange(0)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "next_month"){
            const { start, end } = getMonthRange(1)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "last_week"){
            const { start, end } = getWeekRange(-1)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "this_week"){
            const { start, end } = getWeekRange(0)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "next_week"){
            const { start, end } = getWeekRange(1)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "last_days"){
            const { start, end } = getDaysRange("last_days", days)
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "this_days"){
            const { start, end } = getDaysRange("this_days")
            where.createdAt = { gte: start, lt: end }
        } else if(params.period == "next_days"){
            const { start, end } = getDaysRange("next_days", days)
            where.createdAt = { gte: start, lt: end }
        }
    }

    if(params.priority == true){
        where.priority = { equals: true }
    }

    return where
}
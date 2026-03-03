export function getDayRange(offset: number) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + offset);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return { start, end };
}

export function getMonthRange(offset: number){
    const now = new Date()
    const target = new Date(now)

    target.setMonth(target.getMonth() + offset)

    const start = new Date(target.getFullYear(), target.getMonth(), 1)
    const end = new Date(target.getFullYear(), target.getMonth() + 1, 0, 23, 59, 59, 999)

    return { start, end }
}

export function getWeekRange(offset: number) {
  const now = new Date()
  const target = new Date(now)

  target.setDate(target.getDate() + offset * 7)

  const day = target.getDay()

  const diffToMonday = day === 0 ? -6 : 1 - day

  const start = new Date(target)
  start.setDate(target.getDate() + diffToMonday)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

type DaysType = 'next_days' | 'last_days' | 'this_days'

export function getDaysRange(type: DaysType, days: number = 3) {
  const now = new Date()

  const start = new Date(now)
  const end = new Date(now)

  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  if (type === 'last_days') {
    start.setDate(start.getDate() - days)
  }

  if (type === 'next_days') {
    end.setDate(end.getDate() + days)
  }

  if (type === 'this_days') {
    start.setDate(start.getDate() - 1)
    end.setDate(end.getDate() + 1)
  }

  return { start, end }
}
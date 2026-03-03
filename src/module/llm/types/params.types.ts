export const DATE_VALUES = [
  'today',
  'tomorrow',
  'yesterday',
  // 'explicit_date'
] as const

export const PERIOD_VALUES = [
  'this_week',
  'last_week',
  'next_week',
  'this_month',
  'last_month',
  'next_month',
  'next_days',
  'this_days',
  'last_days'
] as const

export type PeriodValue = typeof PERIOD_VALUES[number]
export type DateValue = typeof DATE_VALUES[number]

export type ParamsResponse = {
  date?: (typeof DATE_VALUES[number]) | null;
  period?: (typeof PERIOD_VALUES[number]) | null;
  days?: number | null
  priority?: boolean | null;
};
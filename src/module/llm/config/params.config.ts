import { DATE_VALUES, PERIOD_VALUES } from "../types/params.types";

export const PARAMS_SYSTEM = {
    date: {
        description: 'Data específica mencionada pelo usuário',
        allowedValues: DATE_VALUES
    },
    period: {
        description: 'Período relativo de tempo mencionado',
        allowedValues: PERIOD_VALUES
    },
    days: {
        description: `Quantidade de dias usado apenas quando period for "next_days", "this_days", "last_days".
        Se o usuário disser:
        - "nos próximos", "nos últimos" ou semelhantes dias → usar 3 como padrão.
        - "nos próximos", "nos últimos" X dias → usar o número informado.

        Nunca usar days se period não for "next_days".
        Valor deve ser inteiro positivo ou negativo entre -30 e 30.
        `,
    },
    priority: {
        description: 'Indica urgência ou importancia mencionada (true ou false)',
        allowedValues: [true, false] as const
    }
}
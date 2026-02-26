import { DATE_VALUES, PERIOD_VALUES } from "../types/params.types";

export const PARAMS_SYSTEM = {
    date: {
        description: 'Data específica mencionada pelo usuário',
        allowedValues: DATE_VALUES
    },
    period: {
        description: 'Período relativo mencionado',
        allowedValues: PERIOD_VALUES
    },
    priority: {
        description: 'Indica se é urgente ou importante (true ou false)',
        allowedValues: [true, false] as const
    }
}
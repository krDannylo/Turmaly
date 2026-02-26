export const INTENTS = {
    GET_ANNOUNCEMENTS: {
        description: 'Buscar avisos, comunicados e publicações de forma geral'
    },
    GET_ANNOUNCEMENTS_PUBLISHED: {
        description: 'Buscar avisos, comunicados ou publicações com base na data de publicação'
    },
    GET_ANNOUNCEMENTS_MENTIONED: {
        description: 'Buscar avisos, comunicados ou publicações que mencionem datas ou períodos no conteúdo'
    },
    GET_CLASSROOMS: {
        description: 'Buscar turmas'
    },
    GET_LESSONS: {
        description: 'Buscar aulas'
    },
    GET_STUDENTS: {
        description: 'Buscar alunos ou colega de turma'
    }
} as const
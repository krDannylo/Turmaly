import { registerAs } from "@nestjs/config"
import type { SignOptions } from 'jsonwebtoken'

// Tipo para expiresIn que aceita número (segundos) ou string timespan
type ExpiresIn = SignOptions['expiresIn']

export default registerAs('jwt', () => {
    // expiresIn aceita número (segundos) ou string timespan (ex: "1h", "7d", "30m")
    let jwtTtl: ExpiresIn = process.env.JWT_TTL as ExpiresIn;
    
    // Se for uma string numérica, converte para número
    if (jwtTtl && typeof jwtTtl === 'string' && !isNaN(Number(jwtTtl))) {
        jwtTtl = Number(jwtTtl);
    }
    
    // Se não estiver definido, usa um valor padrão (ex: 1 hora)
    if (!jwtTtl) {
        jwtTtl = '1h'; // ou 3600 se preferir número
    }

    return {
        secret: process.env.JWT_SECRET,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        issuer: process.env.JWT_TOKEN_ISSUER,
        jwtTtl,
    }
})
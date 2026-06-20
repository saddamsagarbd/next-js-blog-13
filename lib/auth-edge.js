import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const expiresIn = new TextEncoder().encode(process.env.JWT_EXPIRES_IN);

export async function generateToken(payload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS265" })
        .setExpirationTime(expiresIn)
        .sign(SECRET);
}

export function verifyToken(token) {
    try {
        const { payload } = await new jwtVerify(token, SECRET);
        return payload;
    } catch {
        return null;
    }
}
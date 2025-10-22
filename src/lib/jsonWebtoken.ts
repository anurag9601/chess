import jwt from "jsonwebtoken";

export interface generateJWTDataType {
    fName: string;
    lName: string;
    userEmail: string,
    uniqueUserName: string,
}

const secret = process.env.JWT_SECRET || "";

export function generateJWT(payload: generateJWTDataType) {
    const token = jwt.sign(payload, secret, {
        expiresIn: "90d",
        algorithm: "HS512"
    });

    return token;
};

export function verifyJWT(token: string): generateJWTDataType {
    const payload = jwt.verify(token, secret) as generateJWTDataType;

    return payload;
};
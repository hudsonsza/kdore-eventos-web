export function verifyEmail(userEmail) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(userEmail.trim());
};

export function verifyPassword(password) {
    const pattern = /^[\w|\W]{7,20}$/; // Aceita alfanumérico e símbolos
    return pattern.test(password.trim());
};

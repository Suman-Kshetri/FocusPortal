export const generateVerificationToken = () => {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return token;
}

export const setVerificationToken = () => {
    
}
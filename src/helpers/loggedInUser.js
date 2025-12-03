import { decryptMessage } from '../cryptoUtils';

export const loggedInUser = () => {
    try {
        const encryptedData = localStorage.getItem('encryptedUserData');
        if (encryptedData) {
            return JSON.parse(decryptMessage(encryptedData));
        }
        return null;
    } catch (err) {
        console.error("Failed to decrypt user data:", err);
        return null;
    }
};
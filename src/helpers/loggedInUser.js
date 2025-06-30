// import { decryptMessage } from "../cryptoUtils";

// let loggedInUser = null;

// try {
//     const encryptedUser = sessionStorage.getItem('loggedInUser');
//     if (encryptedUser) {
//         const decryptedUser = decryptMessage(encryptedUser);
//         loggedInUser = JSON.parse(decryptedUser);
//     }
// } catch (error) {
//     console.error("Failed to retrieve or parse loggedInUser:", error);
//     loggedInUser = null;
// }

// export { loggedInUser };

import { decryptMessage } from "../cryptoUtils";

let loggedInUser = null;

try {
    const encryptedUser = sessionStorage.getItem('loggedInUser');

    if (encryptedUser && encryptedUser !== 'undefined') {
        const decryptedUser = decryptMessage(encryptedUser);
        loggedInUser = JSON.parse(decryptedUser);
    } else {
        console.warn("No valid encrypted user found in sessionStorage.");
    }
} catch (error) {
    console.error("Failed to retrieve or parse loggedInUser:", error);
    loggedInUser = null;
}

export { loggedInUser };

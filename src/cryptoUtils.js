import keypair from "keypair";
import nodeRSA from "node-rsa";

// Define the public and private keys
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
    MIIBOwIBAAJBAMvK1LJ7bwihkocQQnx4i95eN5Rj1pAyfGhPnDEz2pHx/MFmYEGbGkP5LO3J
    Yjm3ilA8v/6qvbe0a79NS+TSbVkCAwEAAQJAL/5CfQ4IphW29kvj/IA/IE079ZxViXv6RG6L
    MCMwFDJmuRszrk4uXWtOXf8eoqr8SgoLgjC2UYFUz2ctFpV2oQIhAP+1c5wCbLVNU1ljbIoe
    M1F5kIVyVqL0ahPmZQJVdy4lAiEAzAY+Y57bHiUHoBmUzCKns6nAEu9hiAhlikrCVCV1GiUC
    IAGogpRra5sNYlH9FBIdOgX4PNiwsiEiZqG0Z8lJFpnFAiEAw0Uyj1xqcbaVTslNHfgJNC7C
    9ByC55TJwot85NaY9rUCIQCBb0F9E+yEYqftDhUulpJjenUQFmSYKnxDpdf+sJZsoQ==
    -----END RSA PRIVATE KEY-----`;

const pubKey = `-----BEGIN RSA PUBLIC KEY-----
    MEgCQQDLytSye28IoZKHEEJ8eIveXjeUY9aQMnxoT5wxM9qR8fzBZmBBmxpD+SztyWI5t4pQ
    PL/+qr23tGu/TUvk0m1ZAgMBAAE=
    -----END RSA PUBLIC KEY-----`;

// Function to encrypt a message
export function encryptMessage(text) {
    const cipher = new nodeRSA({ b: 512 });
    cipher.importKey(pubKey, "pkcs1-public");
    const encrypted = cipher.encrypt(text, "base64");
    return encrypted;
}

// Function to decrypt a message
// export function decryptMessage(encryptedText) {
//     const decipher = new nodeRSA(privateKey, "pkcs1");
//     const decrypted = decipher.decrypt(encryptedText, "utf8");
//     return decrypted;
// }

// cryptoUtils.js
export function decryptMessage(encryptedText) {
    if (!encryptedText || typeof encryptedText !== 'string') {
        throw new Error("Invalid encrypted text input");
    }

    const decipher = new nodeRSA(privateKey, "pkcs1");
    return decipher.decrypt(encryptedText, "utf8");
}

// Example usage
// const text = { email: "djvndfkjsn@mdg/sdfsv", password: 'sfjndkjfndsfn' };
// const encrypted = encryptMessage(text);

const decrypted = decryptMessage("qOnLIBR4sSI150WPBUdpzsu0Gv3HVQruh4Q9cp70veOZye7mpRr6hO7V3aXvkuTCurqpWgp+4BExttGF9rAsW8GwBTwIP2zoiSGWRynEModij3sgF19Q9xhvouWJR4zAQ6UHpf6NKJ7FcmdgeXAmi7pekYl5d2pbny4KWYBqvw0MY7rDcCRlRSjed7uo1JI/1CV/k4AGzWa/OThlctOswLaKhy9sGKHJ8h7Tf5TNQRZ3mzCFde4TltkSKhxtldd9OkQb2uZuoEbkH2yN/PiEr+AjmI6t5CJWq0/ZvynhKa5eSDsugYb7aO5GXmVQp0JeP+jaGbsEN69k8PepZDZS2w==");

// handleUpload.js
import axios from 'axios';
import { decryptMessage } from '../cryptoUtils'


export const handleUpload = async (file, setLoading) => {
    if (!file) {
        alert('Please select a file first');
        return null;
    }
    setLoading(true);
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/v1/doctor/s3/get-presigned-url`, {
            params: {
                fileName: file.name,
                fileType: file.type,
            },
        });

        // Extract the URL
        let url = decryptMessage(response.data?.data);
        url = JSON.parse(url);
        const uploadResponse = await fetch(url?.url, {
            method: 'PUT',
            headers: {
                'Content-Type': file.type,
            },
            body: file,
        });
        return url;

    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    } finally {
        setLoading(false)
    }
};





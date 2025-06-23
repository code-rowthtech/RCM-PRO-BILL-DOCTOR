export const formatTimeWithAmPm = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

export const usDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
};


export const usDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-US')
}

export const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    // Adjust if the current month/day is before the birth month/day
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12; // Add 12 months to the negative month difference
    }

    // Adjust the month difference for the day of the month
    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    // Ensure months is non-negative after adjustment
    if (months < 0) {
        months += 12;
    }

    return `${years}.${months}`;
};


export const formatPhone = (value) => {
    const digits = value?.replace(/\D/g, '');
    if (!digits) return '';
    const match = digits.match(/(\d{3})(\d{3})(\d{0,4})/);
    if (!match) return '';
    const [, p1, p2, p3] = match;
    return p3 ? `(${p1})${p2}-${p3}` : `(${p1})${p2}`;
};

export const formatDateToISO = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : '';
}

export const today = new Date().toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'

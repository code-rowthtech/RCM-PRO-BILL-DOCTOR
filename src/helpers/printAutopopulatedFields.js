import { loggedInUser } from "./loggedInUser";

export const handlePrintAutopopulatedFields = ({
    populatedFields,
    patientDetails,
    encounterData,
    fieldLabels = {},
    fieldContent = {},
    vitals = []
}) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const capitalize = (str) => str && typeof str === 'string'
        ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
        : '';

    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    const renderVitalsTable = () => {
        if (!vitals || vitals.length === 0) return '';

        const vitalTypes = [
            { key: 'Height', display: 'Height', unit: 'cm/in' },
            { key: 'Weight', display: 'Weight', unit: 'kg/lbs' },
            { key: 'BMI', display: 'BMI', unit: 'kg/m²' },
            { key: 'Blood Pressure', display: 'BP', unit: 'mmHg' },
            { key: 'Temperature', display: 'Temperature', unit: '°C/°F' },
            { key: 'Pulse', display: 'Pulse', unit: 'bpm' },
            { key: 'Respiratory Rate', display: 'Respiratory Rate', unit: 'rpm' },
            { key: 'Oxygen Saturation', display: 'O₂ Saturation', unit: '%' },
            { key: 'Pain', display: 'Pain', unit: '(0-10)' }
        ];

        const groupedByDate = vitals.reduce((acc, vitalGroup) => {
            const date = new Date(vitalGroup.effectiveDateTime).toLocaleDateString('en-US');
            const time = new Date(vitalGroup.effectiveDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const key = `${date} (${time})`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(...vitalGroup.vitals);
            return acc;
        }, {});

        const sortedDates = Object.keys(groupedByDate).sort((a, b) =>
            new Date(a.split(' ')[0]) - new Date(b.split(' ')[0])
        );

        const getVitalValue = (entries, type) => {
            const vital = entries.find(v => v.code?.text === type.key || v.code?.coding?.[0]?.display === type.key);
            if (!vital) return '-';
            if (vital.component?.length > 0) {
                const systolic = vital.component.find(c => c.code?.coding?.[0]?.code === '8480-6')?.valueQuantity?.value;
                const diastolic = vital.component.find(c => c.code?.coding?.[0]?.code === '8462-4')?.valueQuantity?.value;
                return systolic && diastolic ? `${systolic}/${diastolic}` : '-';
            }
            return vital.valueString || (vital.valueQuantity ? `${vital.valueQuantity.value} ${vital.valueQuantity.unit || ''}`.trim() : '-');
        };

        return `
            <div class="field-section">
                <h4 class="field-title">Vitals</h4>
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr>
                                <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: left;">Vital Sign</th>
                                ${sortedDates.map(date => `<th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2; text-align: center;">${date}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${vitalTypes.map(type => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${type.display} (${type.unit})</td>
                                    ${sortedDates.map(date => `<td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${getVitalValue(groupedByDate[date], type)}</td>`).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    const renderFieldData = (fieldName, dataArray) => {
        const label = fieldLabels[fieldName] || fieldName;
        const content = fieldContent[fieldName] || '';
        const hasReferencedData = dataArray && dataArray.length > 0;
        const hasFieldContent = content && stripHtml(content).trim();

        if (!hasReferencedData && !hasFieldContent) {
            return `
                <div class="field-section">
                    <h4 class="field-title">${label}</h4>
                    <p class="no-data">No data available</p>
                </div>
            `;
        }

        return `
            <div class="field-section">
                <h4 class="field-title">${label}</h4>
                <div class="field-content">
                    ${hasFieldContent ? `
                        <div class="content-section">
                            <h5 style="color: #2c3e50; margin-bottom: 10px;">Notes:</h5>
                            <div class="field-text" style="background: white; padding: 15px; border-radius: 3px; margin-bottom: 15px; border-left: 3px solid #27ae60;">
                                ${stripHtml(content)}
                            </div>
                        </div>
                    ` : ''}
                    ${hasReferencedData ? `
                        <div class="referenced-section">
                            <h5 style="color: #2c3e50; margin-bottom: 10px;">Referenced Data:</h5>
                            ${dataArray.map((data, index) => `
                                <div class="data-item">
                                    <span class="item-number">${index + 1}.</span>
                                    <span class="item-text">${stripHtml(data)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    };

    const printContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Field Content Report</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            font-size: 14px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
        }

        .logo {
            height: 50px;
        }

        .report-title {
            text-align: center;
            margin-bottom: 15px;
            color: #2c3e50;
            font-size: 22px;
        }

        .patient-info, .report-info {
            width: 48%;
        }

        .patient-info h4, .report-info h4 {
            color: #3498db;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        }

        .info-row {
            margin-bottom: 5px;
        }

        .field-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 15px;
            background-color: #fafafa;
        }

        .field-title {
            background-color: #3498db;
            color: white;
            padding: 8px 12px;
            margin: -15px -15px 15px -15px;
            border-radius: 5px 5px 0 0;
            font-size: 16px;
        }

        .field-content {
            padding: 10px 0;
        }

        .data-item {
            display: flex;
            margin-bottom: 12px;
            padding: 10px;
            background-color: white;
            border-left: 3px solid #3498db;
            border-radius: 3px;
        }

        .item-number {
            font-weight: bold;
            margin-right: 10px;
            color: #7f8c8d;
            min-width: 25px;
        }

        .item-text {
            flex: 1;
            word-wrap: break-word;
        }

        .no-data {
            color: #7f8c8d;
            font-style: italic;
            text-align: center;
            padding: 15px;
        }

        footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
            border-top: 1px solid #e0e0e0;
            padding-top: 15px;
        }

        @media print {
            body {
                padding: 0;
                font-size: 12px;
            }

            .field-section {
                margin-bottom: 15px;
            }

            @page {
                size: auto;
                margin: 10mm;
            }
        }
    </style>
</head>
<body>
    <img src='https://bitplatypus.s3.eu-north-1.amazonaws.com/logo_sm.png' alt="Logo" class="logo" />
    
    <div class="header">
        <div class="patient-info">
            <h4>PATIENT INFORMATION</h4>
            <div class="info-row"><strong>Name:</strong> ${capitalize(patientDetails?.name?.[0]?.prefix) ? capitalize(patientDetails?.name?.[0]?.prefix) + ' ' : ''}${patientDetails?.name?.[0]?.given?.map(name => capitalize(name)).join(' ') || ''}${patientDetails?.name?.[0]?.given?.length ? ' ' : ''}${capitalize(patientDetails?.name?.[0]?.family) || 'N/A'}</div>
            <div class="info-row"><strong>DOB:</strong> ${patientDetails?.birthDate ? new Date(patientDetails.birthDate).toLocaleDateString('en-US') : 'N/A'}</div>
            <div class="info-row"><strong>Age:</strong> ${patientDetails?.approxAge ? Math.floor(patientDetails.approxAge) + ' years' : 'N/A'}</div>
            <div class="info-row"><strong>Gender:</strong> ${capitalize(patientDetails?.gender) || 'N/A'}</div>
            <div class="info-row"><strong>MRN:</strong> ${patientDetails?.chartNumber || 'N/A'}</div>
        </div>
        
        <div class="report-info">
            <h4>REPORT DETAILS</h4>
            <div class="info-row"><strong>Provider:</strong> ${loggedInUser()?.name || 'N/A'}</div>
            <div class="info-row"><strong>Email:</strong> ${loggedInUser()?.email || 'N/A'}</div>
            <div class="info-row"><strong>Date Printed:</strong> ${formatDate(new Date())}</div>
            ${encounterData?.period?.start ? `<div class="info-row"><strong>Encounter Date:</strong> ${formatDate(encounterData.period.start)}</div>` : ''}
        </div>
    </div>

    ${renderVitalsTable()}
    
    ${Object.keys(populatedFields).map(fieldName =>
        renderFieldData(fieldName, populatedFields[fieldName])
    ).join('')}

    <footer>
        <p>This report was generated electronically and does not require a signature.</p>
    </footer>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Popup blocked. Please allow popups for this site.');
        return;
    }

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };
};

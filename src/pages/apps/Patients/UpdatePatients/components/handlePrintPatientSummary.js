export const handlePrintPatientSummary = async (printData) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            return '';
        }
    };

    const statusClass = (status) => {
        const map = {
            active: 'status-success',
            'on-hold': 'status-warning',
            cancelled: 'status-danger',
            completed: 'status-primary',
            'entered-in-error': 'status-danger',
            stopped: 'status-secondary',
            draft: 'status-muted',
            unknown: 'status-dark',
        };
        return map[status] || '';
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Address formatting
    const addressData = printData?.patientDetails?.address;
    const selectedAddress =
        addressData?.find(a => a.type === 'physical') ||
        addressData?.find(a => a.type === 'postal') ||
        addressData?.find(a => a.type === 'both');

    const addressString = selectedAddress
        ? `${selectedAddress?.line?.join(', ')}, ${selectedAddress?.city}, ${selectedAddress?.state}, ${selectedAddress?.postalCode || ''}`
        : 'Not available';

    // VITALS processing
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

    const groupedByDate = printData?.vitals?.reduce((acc, vitalGroup) => {
        const date = new Date(vitalGroup?.effectiveDateTime).toLocaleDateString('en-US');
        const time = new Date(vitalGroup?.effectiveDateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        const key = `${date} (${time})`;

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(...vitalGroup?.vitals);
        return acc;
    }, {});

    const sortedDates = groupedByDate && typeof groupedByDate === 'object'
        ? Object.keys(groupedByDate).sort((a, b) => {
            return new Date(a.split(' ')[0].split('/').reverse().join('-')) -
                new Date(b.split(' ')[0].split('/').reverse().join('-'));
        })
        : [];

    const getVitalValue = (entries, type) => {
        const vital = entries.find(v =>
            v.code?.text === type.key ||
            v.code?.coding?.[0]?.display === type.key
        );

        if (!vital) return '';

        if (vital.component?.length > 0) {
            const systolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === '8480-6' ||
                c.code?.coding?.[0]?.display?.includes('Systolic')
            )?.valueQuantity?.value;

            const diastolic = vital.component.find(c =>
                c.code?.coding?.[0]?.code === '8462-4' ||
                c.code?.coding?.[0]?.display?.includes('Diastolic')
            )?.valueQuantity?.value;

            return systolic && diastolic ? `${systolic}/${diastolic} mmHg` : '';
        }

        if (vital?.valueString) {
            return vital?.valueString;
        }

        if (vital?.valueQuantity) {
            return `${vital?.valueQuantity.value} ${vital?.valueQuantity.unit || ''}`.trim();
        }

        return '';
    };

    const rows = vitalTypes?.map(type => {
        const rowData = sortedDates.map(date => {
            return getVitalValue(groupedByDate[date], type);
        });

        const tds = rowData.map(val => `<td>${val || '-'}</td>`).join('');
        return `<tr><td>${type?.display} (${type?.unit})</td>${tds}</tr>`;
    });

    const printContent = `   
    <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Patient Summary Report</title>
            <style>
                @media print {
                    @page {
                        margin: 0.5in;
                        size: A4;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        color-adjust: exact;
                    }
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.4;
                    color: #333;
                    background: white;
                }

                .header {
                    background: linear-gradient(135deg, rgb(249, 139, 55) 0%,rgba(97, 104, 208, 0.79) 100%);
                    color: white;
                    padding: 20px;
                    margin-bottom: 30px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .header h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .header img{
                    border-radius: 100%;
                }

                .patient-info {
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 25px;
                }

                .patient-info h2 {
                    color: #6169D0;
                    font-size: 18px;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #6169D0;
                    padding-bottom: 8px;
                }

                .patient-details {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                }

                .detail-value {
                    font-size: 14px;
                    color: #1f2937;
                }

                .summary-headers{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .status-success { background-color: #d4edda; color: #155724; }
                .status-warning { background-color: #fff3cd; color: #856404; }
                .status-danger { background-color: #f8d7da; color: #721c24; }
                .status-primary { background-color: #cce5ff; color: #004085; }
                .status-secondary { background-color: #e2e3e5; color: #383d41; }
                .status-muted { background-color: #f7f7f7; color: #6c757d; }
                .status-dark { background-color: #d6d8d9; color: #1b1e21; }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    page-break-inside: avoid;
                    box-shadow: none !important;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 6px;
                    text-align: center;
                }
                th {
                    background-color: #f2f2f2;
                    font-weight: bold;
                    color: black !important;
                }

                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <img height='60' crossOrigin="anonymous" alt="Dynamic" width='65' src='https://probill-ehr.s3.eu-north-1.amazonaws.com/Medical-healthy-clinic-logo-concept-by-DEEMKA-STUDIO-1.jpg'/>
                <h1>Patient Summary</h1>
            </div>

            <div class="patient-info">
                <h2>Patient Information</h2>
                <div class="patient-details">
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${printData?.patientDetails?.name?.find((data) => data?.use === 'official')?.text || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">DOB</span>
                        <span class="detail-value">${printData?.patientDetails?.birthDate ? new Date(printData?.patientDetails?.birthDate)?.toISOString()?.split('T')[0] : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">${printData?.patientDetails?.gender || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email</span>
                        <span class="detail-value">${printData?.patientDetails?.telecom?.find((data) => data?.system === 'email')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Contact no.</span>
                        <span class="detail-value">${'+1-' + printData?.patientDetails?.telecom?.find((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${addressString}</span>
                    </div>
                </div>
            </div>

            ${printData?.toBePrinted?.some((data) => data === "Allergies") ?
            ` <div class="patient-info">
                   <h2>Allergies</h2>
                   ${printData?.allergyData?.map((allergy, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                        ${index + 1 + '.'} ${allergy?.code?.text || allergy?.code?.coding?.[0]?.display || ' '}
                        <small>${allergy?.code?.coding?.[0]?.code || ''}</small>
                    </b>
                    <div class="detail-value">
                        <p>${formatDate(allergy?.onset?.onsetDateTime)}</p>
                        <p class="${statusClass(allergy?.clinicalStatus?.text?.toLowerCase() || allergy?.clinicalStatus?.coding?.[0]?.display?.toLowerCase())}">
                            ${capitalizeFirst(allergy?.clinicalStatus?.text || allergy?.clinicalStatus?.coding?.[0]?.display)}
                        </p>
                    </div>
                </div>
                <div>${allergy?.note?.[0]?.text || ''}</div>`
            )).join('')}
            </div>`
            : ''
        }

        ${printData?.toBePrinted?.some((data) => data === "Problems") ?
            ` <div class="patient-info">
                   <h2>Problems</h2>
                   ${printData?.problemData?.map((problem, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                        ${index + 1 + '.'} ${problem?.code?.text || problem?.code?.coding?.[0]?.display || ' '}
                        <small>${problem?.code?.coding?.[0]?.code || ''}</small>
                    </b>
                    <div class="detail-value">
                        <p>${formatDate(problem?.onsetDateTime)}</p>
                        <p class="${statusClass(problem?.clinicalStatus?.text?.toLowerCase())}">
                            ${capitalizeFirst(problem?.clinicalStatus?.text || problem?.clinicalStatus?.[0]?.coding?.[0]?.display || '-')}
                        </p>
                    </div>
                </div>
                <div>${problem?.note?.[0]?.text || problem?.note?.[0]?.coding?.[0]?.display || ''}</div>`
            )).join('')}
            </div>`
            : ''
        }

        ${printData?.toBePrinted?.some((data) => data === "Medications") ?
            ` <div class="patient-info">
                   <h2>Medications</h2>
                   ${printData?.medicationList?.map((medication, index) => (
                `<div class="summary-headers">
                    <b class="detail-label">
                        ${index + 1 + '.'} ${medication?.drugId?.proprietaryName}
                        <small>${medication?.drugId?.nonProprietaryName || ''}</small>
                    </b>
                    <div class="detail-value">
                        <p>${formatDate(medication?.startDate) + ' - '}${formatDate(medication?.endDate)}</p>
                        <p class="${statusClass(medication?.status?.toLowerCase())}">
                            ${capitalizeFirst(medication?.status)}
                        </p>
                    </div>
                </div>
                <div>${medication?.timing?.code?.text || ''}</div>
                <div>${medication?.note?.[0]?.text || ''}</div>`
            )).join('')}
            </div>`
            : ''
        }
       
        ${printData?.toBePrinted?.some((data) => data === "Vitals List") ?
            ` <div class="patient-info">
                   <h2>VITALS FLOWSHEET</h2>
                   <table>
                        <thead>
                            <tr>
                                <th>Vital Sign</th>
                                ${sortedDates?.map(date => `<th>${date}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.join('')}
                        </tbody>
                    </table>
              </div>`
            : ''
        }

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
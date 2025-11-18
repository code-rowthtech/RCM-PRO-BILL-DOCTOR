import { loggedInUser } from "../../../../../../helpers/loggedInUser";

export const handlePrintEncounters = (encounterData, patientDetails) => {
    const printContent = `
         <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Medical Encounter Report</title>
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
                }

                .header h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .header-info {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 15px;
                    font-size: 14px;
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

                .encounter-section {
                    margin-bottom: 25px;
                    break-inside: avoid;
                }

                .section-header {
                    background: #6169D0;
                    color: white;
                    padding: 12px 16px;
                    font-weight: 600;
                    font-size: 16px;
                    border-radius: 6px 6px 0 0;
                    margin-bottom: 0;
                }

                .section-content {
                    background: white;
                    border: 2px solid #6169D0;
                    border-top: none;
                    padding: 20px;
                    border-radius: 0 0 6px 6px;
                    min-height: 60px;
                }

                .provider-signature {
                    margin-top: 30px;
                    padding: 20px;
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    text-align:right;
                }

                .signature-line {
                    width: 300px;
                    margin: 20px 0 10px 0;
                }

                .text-content {
                    white-space: pre-line;
                    line-height: 1.5;
                }

                @media print {
                    .no-print {
                        display: none;
                    }
                    
                    .encounter-section {
                        page-break-inside: avoid;
                    }
                    
                    .header {
                        page-break-after: avoid;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Medical Encounter Report</h1>
                <div class="header-info">
                    <div>
                        <strong>Provider:</strong> ${encounterData?.providerId?.name?.find((data) => data?.use === 'official')?.text || loggedInUser?.name || 'Not available'}
                    </div>
                    <div>
                        <strong>Date:</strong> ${encounterData?.period?.start ? new Date(encounterData?.period?.start)?.toISOString()?.split('T')?.[0] : 'Not specified'}
                    </div>
                    <div>
                        <strong>Status:</strong> ${encounterData?.status?.charAt(0).toUpperCase() + encounterData?.status.slice(1) || 'UNKNOWN'}
                    </div>
                    <div>
                        <strong>Encounter Type:</strong> ${encounterData?.type?.[0]?.coding?.[0]?.display || 'Standard Visit'}
                    </div>
                </div>
            </div>

            <div class="patient-info">
                <h2>Patient Information</h2>
                <div class="patient-details">
                    <div class="detail-item">
                        <span class="detail-label">Name</span>
                        <span class="detail-value">${patientDetails?.name?.[0]?.text || 'Not available'}</span>
                    </div>
                     <div class="detail-item">
                        <span class="detail-label">Gender</span>
                        <span class="detail-value">${patientDetails?.gender ? patientDetails.gender.charAt(0).toUpperCase() + patientDetails.gender.slice(1) : 'Not available'}</span>
                    </div>
                     <div class="detail-item">
                        <span class="detail-label">DOB</span>
                        <span class="detail-value">${patientDetails?.birthDate ? new Date(patientDetails?.birthDate)?.toISOString()?.split('T')?.[0] : 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email Id</span>
                        <span class="detail-value">${patientDetails?.telecom?.find?.((data) => data?.system === 'email')?.value || 'Not available'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Phone No.</span>
                        <span class="detail-value">${patientDetails?.telecom?.find?.((data) => data?.system === 'phone')?.value || 'Not available'}</span>
                    </div>
                   
                    <div class="detail-item">
                        <span class="detail-label">Address</span>
                        <span class="detail-value">${patientDetails?.address?.[0]?.line + ', ' || ''} ${patientDetails?.address?.[0]?.city + ', ' || ''} 
                        ${patientDetails?.address?.[0]?.state + ', ' || ''} ${'(' + patientDetails?.address?.[0]?.postalCode + '), ' || ''}</span>
                    </div>
                </div>
            </div>
            ${encounterData?.data?.length === 0 ?
            '<div class="encounter-section"><div class="section-content">No encounter data available</div></div>'
            :
            encounterData?.data?.map((section, index) => `
                <div class="encounter-section">
                    <h3 class="section-header">${section?.type || 'Section'}</h3>
                    <div class="section-content">
                        ${section?.content?.value || 'No content available'}
                    </div>
                </div>
            `).join('')
        }

            <div class="provider-signature">
            <div class="signature-line"></div>
            <strong>Provider Signature</strong>
            <br/>
            <span>${new Date()?.toISOString()?.split('T')?.[0]}</span>
            </div>
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
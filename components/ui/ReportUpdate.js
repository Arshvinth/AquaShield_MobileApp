import React, { useEffect, useState } from 'react'

export default function ReportUpdate({ visible, onClose, report, onUpdate }) {

    const [formData, setFormData] = useState({
        locationInfo: {
            type: "Point",
            coordinates: [],
            lat: "",
            lng: "",
            description: "",
        },
        incidentInfo: {
            incidentDate: "",
            incidentTime: "",
            incidentType: "",
            species: "",
            description: "",
        },
        evidences: [],
        personalInfo: {
            name: "",
            mobile: "",
            email: "",
            annonimity: false,
        },
    });

    useEffect(() => {
        if (report) {
            setFormData(prev => ({
                ...prev,
                locationInfo: report.locationInfo,
                incidentInfo: report.incidentInfo,
                evidences: report.evidences,
                personalInfo: report.personalInfo
            }));
        }
    }, [report]);

    return (
        <div>ReportUpdate</div>
    )
}

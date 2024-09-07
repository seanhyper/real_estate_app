import React, { useState } from 'react';

function SellerForm() {
    const [formData, setFormData] = useState({
        currentOffer: '',
        threshold: '',
        highestTeamOffer: '',
        costPerInquiry: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/addProjectData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        }).then((response) => {
            console.log("Data submitted");
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="number"
                placeholder="Current Offer"
                value={formData.currentOffer}
                onChange={(e) => setFormData({ ...formData, currentOffer: e.target.value })}
            />
            <input
                type="number"
                placeholder="Threshold"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: e.target.value })}
            />
            <input
                type="number"
                placeholder="Highest Team Offer"
                value={formData.highestTeamOffer}
                onChange={(e) => setFormData({ ...formData, highestTeamOffer: e.target.value })}
            />
            <input
                type="number"
                placeholder="Cost Per Inquiry"
                value={formData.costPerInquiry}
                onChange={(e) => setFormData({ ...formData, costPerInquiry: e.target.value })}
            />
            <button type="submit">Submit</button>
        </form>
    );
}

export default SellerForm;

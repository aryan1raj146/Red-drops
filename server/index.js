const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// API route to register a donor
app.post('/api/donors', (req, res) => {
    const data = req.body;

    const query = `
        INSERT INTO donors (
            name, dob, gender, weight, phone, email, address, blood_group,
            medical_hiv, medical_hepatitis, medical_bp, medical_sugar,
            medical_antibiotics, antibiotics_detail, medical_surgery,
            surgery_detail, medical_pregnant, donating_first_time, last_donation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        data.name,
        data.dob,
        data.gender,
        data.weight,
        data.phone,
        data.email,
        data.address,
        data.bloodGroup,
        data.medical_hiv,
        data.medical_hepatitis,
        data.medical_bp,
        data.medical_sugar,
        data.medical_antibiotics,
        data.antibiotics_detail || null,
        data.medical_surgery,
        data.surgery_detail || null,
        data.medical_pregnant,
        data.donating_first_time,
        data.lastDonation || null
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Database insertion failed.' });
        }
        res.status(201).json({ message: 'Donor registered successfully!', id: result.insertId });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const db = require('../db');

exports.contactForm = async (req, res) => {
    const { full_name, email, message } = req.body;
    try {
        const result = await db.query('INSERT INTO contact (full_name, email, message) VALUES ($1, $2, $3) RETURNING *',
            [full_name, email, message]);
        if (result.rows.length > 0) {
            console.log('We will get back to you as soon as possible', result.rows[0]);
            res.status(200).json({ message: 'Contact form submitted successfully', data: result.rows[0] });
        } else {
            console.log('No data returned from insert operation.');
            res.status(500).json({ error: 'Internal Server error' });
        }
    } catch (error) {
        console.error('Error inserting contact form data:', error.message);
        res.status(500).json({ error: 'Internal Server error' });
    }
};

const db = require('../db');

exports.submitForm = async (req, res) => {
  const { fullName, courseCode, expectations, academicLevel, studyGoal } = req.body;

  try {
    // Insert form data into the 'study_partners' table
    const result = await db.query(
      'INSERT INTO matchform (fullname, coursecode, expectations, academiclevel, studygoal) VALUES ($1, $2, $3, $4, $5) ',
      [fullName, courseCode, expectations, academicLevel, studyGoal]
    );
    
    console.log('Form data inserted successfully:', result.rows[0]);
    
    // Send a success response to the client
    res.status(201).json({ success: true, message: 'Form submitted successfully', data: result.rows[0] });
  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Send an error response to the client
    res.status(500).json({ error: 'An error occurred while submitting the form' });
  }
};

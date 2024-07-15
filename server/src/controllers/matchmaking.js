const db = require('../db');

exports.submitForm = async (req, res) => {
  const { fullName, courseCode, expectations, academicLevel, studyGoal } = req.body;
  const user_id = req.user.id;

  try {
    // Insert form data into the 'matchform' table
    const result = await db.query(
      'INSERT INTO matchform (user_id, fullname, coursecode, expectations, academiclevel, studygoal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, fullName, courseCode, expectations, academicLevel, studyGoal]
    );

    if (result.rows.length > 0) {
      console.log('Form data inserted successfully:', result.rows[0]);

      // Call matchMaking function
      await exports.matchMaking(user_id, courseCode, studyGoal, res);
    } else {
      console.log('No data returned from insert operation.');
      res.status(500).json({ error: 'Failed to insert form data.' });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    // Send an error response to the client
    res.status(500).json({ error: 'An error occurred while submitting the form' });
  }
};

exports.matchMaking = async (user_id, courseCode, studyGoal, res) => {
  try {
    const data = await db.query(
      'SELECT * FROM matchform WHERE user_id != $1 AND coursecode = $2 AND studygoal = $3',
      [user_id, courseCode, studyGoal]
    );

    const number_of_partner = data.rowCount;

    if (number_of_partner === 0) {
      console.log("No partner was found");
      res.status(200).json({ success: true, message: 'No partner found' });
    } else {
      const result = data.rows[0];
      console.log("You are matched");

      const portal = await db.query(
        'INSERT INTO partners (course_code, partner_1_id, partner_2_id) VALUES ($1, $2, $3) RETURNING *',
        [courseCode, user_id, result.user_id]
      );
      const move = await db.query(
        'DELETE FROM matchform WHERE (user_id = $1 OR user_id = $2) AND coursecode = $3 ',
        [user_id, result.user_id, courseCode]
      )
      console.log("Portal created successfully", portal.rows[0]);
      res.status(201).json({ success: true, message: 'Matched successfully', data: portal.rows[0] });
    }
  } catch (error) {
    console.log("Error matching partner: ", error);
    res.status(500).json({ error: 'An error occurred while matching partner' });
  }
};

exports.getPortals = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM partners WHERE partner_1_id = $1 OR partner_2_id = $1',
      [user_id]
    );
    res.status(200).json({ success: true, portals: result.rows});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
};

exports.getPortalByCourseCode = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM partners WHERE id = $1 AND (partner_1_id = $2 OR partner_2_id = $2)',
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Partner not found'});
    }
    res.status(200).json({ success: true, portal: result.rows[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
};

exports.unMatchPartner = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await db.query(
      'DELETE FROM partners WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, user_id]
    );
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Partner not found'});
    }
    res.status(200).json({ success: true, message: 'Activity deleted successfully'});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server'});
  }
}
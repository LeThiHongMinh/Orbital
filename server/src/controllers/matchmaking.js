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

exports.unMatchPartner = async (red, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const fetchResult = await db.query(
      'SELECT * FROM partners WHERE id = $1 AND (partner_1_id = $2 OR partner_2_id = $2)',
      [id, user_id]
    );
    if (fetchResult.rows.length === 0) {
      return res.status(400).json({ error: 'Partner not found'});
    }
    const currentStatus = fetchResult.rows[0].status;
    const newStatus = !currentStatus;
    const updateResult = await db.query(
      'UPDATE partners SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [newStatus, id, user_id]
    );
    res.status(200).json({ success: true, portal: updateResult.rows[0]});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal server'});
  }
};

exports.getMatchedUsers = async (req, res) => {
  const userEmail = req.user.email; // Assuming user's email is extracted from the authenticated user

  try {
    // Fetch user_id of the authenticated user based on their email
    const userResult = await db.query('SELECT user_id FROM users WHERE email = $1', [userEmail]);
    const { user_id } = userResult.rows[0]; // Extract user_id from the query result

    // Fetch all partners where the current user is either partner_1_id or partner_2_id
    const partners = await db.query(
      'SELECT * FROM partners WHERE partner_1_id = $1 OR partner_2_id = $1',
      [user_id]
    );

    // If no partners found, return empty response or appropriate message
    if (partners.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No partners found' });
    }

    // Array to store user data of matched users
    let matchedUsers = [];

    // Loop through each partner entry and fetch user details for partner_1_id and partner_2_id
    for (const partner of partners.rows) {
      // Determine which partner ID is not the current user's ID
      const partner1Id = partner.partner_1_id;
      const partner2Id = partner.partner_2_id;

      // Fetch details of partner 1 user
      const user1Data = await db.query(
        'SELECT user_id, full_name FROM users WHERE user_id = $1',
        [partner1Id]
      );

      // Fetch details of partner 2 user
      const user2Data = await db.query(
        'SELECT user_id, full_name FROM users WHERE user_id = $1',
        [partner2Id]
      );

      // Add user details to matchedUsers array
      matchedUsers.push({
        partner1: user1Data.rows[0], // User details for partner 1
        partner2: user2Data.rows[0], // User details for partner 2
        course_code: partner.course_code,
        status: partner.status
      });
    }

    res.status(200).json({ success: true, matchedUsers });
  } catch (error) {
    console.error('Error fetching matched users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// yourControllerFile.js
exports.submitFeedback = async (req, res) => {
  const { partnerId, comments, rating } = req.body;
  const userEmail = req.user.email; // Assuming user's email is extracted from the authenticated user

  try {
    // Fetch user_id of the authenticated user based on their email
    const userResult = await db.query('SELECT user_id FROM users WHERE email = $1', [userEmail]);
    const { user_id: userId } = userResult.rows[0]; // Extract user_id from the query result

    // Fetch both partner_1_id and partner_2_id from partners where the current user's user_id matches
    const partnerResult = await db.query(
      'SELECT partner_1_id, partner_2_id FROM partners WHERE partner_1_id = $1 OR partner_2_id = $1',
      [userId]
    );

    if (partnerResult.rows.length === 0) {
      return res.status(400).json({ error: 'You are not matched with any partner' });
    }

    const { partner_1_id, partner_2_id } = partnerResult.rows[0];

    // Insert feedback into the feedback table
    await db.query(
      'INSERT INTO feedback (user_id, partner_id, comments, rating) VALUES ($1, $2, $3, $4)',
      [userId, partner_1_id === userId ? partner_2_id : partner_1_id, comments, rating]
    );

    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

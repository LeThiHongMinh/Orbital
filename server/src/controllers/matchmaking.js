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
      await db.query(
        'INSERT INTO noti (user_id, description) VALUES ($1, $2)',
        [user_id, 'No partner found for the given criteria.']
      );
      res.status(200).json({ success: true, message: 'No partner found' });
    } else {
      const result = data.rows[0];
      console.log("You are matched");

      const portal = await db.query(
        'INSERT INTO partners (course_code, partner_1_id, partner_2_id) VALUES ($1, $2, $3) RETURNING *',
        [courseCode, user_id, result.user_id]
      );
      await db.query(
        'DELETE FROM matchform WHERE (user_id = $1 OR user_id = $2) AND coursecode = $3 ',
        [user_id, result.user_id, courseCode]
      );

      // Notify both users about the successful match
      await db.query(
        'INSERT INTO noti (user_id, description) VALUES ($1, $2)',
        [user_id, 'You have been successfully matched with a partner!']
      );
      await db.query(
        'INSERT INTO noti (user_id, description) VALUES ($1, $2)',
        [result.user_id, 'You have been successfully matched with a partner!']
      );
      
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

  try {
    const deleteResult = await db.query(
      'DELETE FROM partners WHERE id = $1 RETURNING *',
      [id]
    );
    if (deleteResult.rows.length === 0) {
      return res.status(400).json({ error: 'Failed to delete partner relation.' });
    }
    await db.query(
      'INSERT INTO noti (user_id, description) VALUES ($1, $2)',
      [deleteResult.rows[0].partner_1_id, 'Your match are successfully deleted !']
    );

    await db.query(
      'INSERT INTO noti (user_id, description) VALUES ($1, $2)',
      [deleteResult.rows[0].partner_2_id, 'Your match are successfully deleted !']
    );

    res.status(200).json({ success: true, message: 'Partner relation deleted successfully.' });
  } catch (error) {
    console.error('Error unmatching partner:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMatchedUsers = async (req, res) => {
  const user_id = req.user.id;

  try {
    const partners = await db.query('SELECT * FROM partners WHERE partner_1_id = $1 OR partner_2_id = $1', [user_id]);
    if (partners.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No partners found' });
    }

    let matchedUsers = [];
    for (const partner of partners.rows) {
      const partner1Data = await db.query('SELECT user_id, email, full_name, bio FROM users WHERE user_id = $1', [partner.partner_1_id]);
      const partner2Data = await db.query('SELECT user_id, email, full_name, bio FROM users WHERE user_id = $1', [partner.partner_2_id]);

      matchedUsers.push({
        partner1: partner1Data.rows[0],
        partner2: partner2Data.rows[0],
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

exports.getMatchedUserById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const partners = await db.query(
      'SELECT * FROM partners WHERE (partner_1_id = $1 OR partner_2_id = $1) AND id = $2',
      [user_id, id]
    );

    if (partners.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No partners found' });
    }

    const partner = partners.rows[0];
    
    const user1Data = await db.query(
      'SELECT user_id, email, full_name, bio, tele, avatar FROM users WHERE user_id = $1',
      [partner.partner_1_id]
    );
    
    const user2Data = await db.query(
      'SELECT user_id, email, full_name, bio, tele, avatar FROM users WHERE user_id = $1',
      [partner.partner_2_id]
    );

    // Encode avatar if available
    if (user1Data.rows[0].avatar) {
      user1Data.rows[0].avatar = `data:image/png;base64,${user1Data.rows[0].avatar.toString('base64')}`;
    }

    if (user2Data.rows[0].avatar) {
      user2Data.rows[0].avatar = `data:image/png;base64,${user2Data.rows[0].avatar.toString('base64')}`;
    }

    res.status(200).json({
      success: true,
      matchedUsers: {
        partner1: user1Data.rows[0], 
        partner2: user2Data.rows[0], 
        course_code: partner.course_code,
      },
    });
  } catch (error) {
    console.error('Error fetching matched users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.submitFeedback = async (req, res) => {
  const id = req.params.id; 
  const { comments, rating } = req.body;
  const user_id = req.user.id;

  try {
    // Query the partners table to find the partner IDs for the given ID
    const partnerResult = await db.query(
      'SELECT partner_1_id, partner_2_id FROM partners WHERE id = $1',
      [id]
    );

    // Check if the query returned any rows
    if (partnerResult.rows.length === 0) {
      return res.status(400).json({ error: 'You are not matched with any partner' });
    }

    // Determine the partner ID based on the current user ID
    const { partner_1_id, partner_2_id } = partnerResult.rows[0];
    let partnerID;
    if (partner_1_id === user_id) {
      partnerID = partner_2_id;
    } else if (partner_2_id === user_id) {
      partnerID = partner_1_id;
    } else {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Ensure the partner ID is valid
    if (partnerID !== partner_1_id && partnerID !== partner_2_id) {
      return res.status(400).json({ error: 'Invalid partner ID' });
    }

    // Insert feedback into the database
    await db.query(
      'INSERT INTO feedback (user_id, partner_id, comments, rating) VALUES ($1, $2, $3, $4)',
      [user_id, partnerID, comments, rating]
    );

    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.uploadFileForMatchedUsers = async (req, res) => {
  try {
    const { name, description, courseCode, email1, email2} = req.body;
    

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileData = req.file.buffer;
    const result = await db.query(
      'INSERT INTO matched_files (name, description, file_data, course_code, email1, email2, upload_date) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING id',
      [name, description, fileData, courseCode,  email1, email2]
    );

    const fileId = result.rows[0].id;
    res.status(201).json({ success: true, fileId });
  } catch (error) {
    console.error('Error uploading file for matched users:', error);
    res.status(500).json({ success: false, error: 'Error uploading file' });
  }
};

exports.getFilesForMatchedUsers = async (req, res) => {
  const email1 = req.user.email;

  try {
    const client = await db.connect();
    console.log('Connected to the database.');

    const result = await client.query(
      'SELECT id, name, description, course_code, file_data FROM matched_files WHERE email1 = $1 OR email2 = $1',
      [email1]
    );

    client.release();
    console.log('Query executed successfully.');

    if (result.rows.length === 0) {
      console.log('No files found for the specified email and course');
      return res.status(404).json({ success: false, error: 'No files found for the specified email and course' });
    }

    const file = result.rows;
    res.status(200).json({ success: true, files: file });

  } catch (error) {
    console.error('Error fetching files for matched users:', error);
    res.status(500).json({ success: false, error: 'Error fetching files' });
  }
};

exports.getNoti = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await db.query(
      'SELECT * FROM noti WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'An error occurred while fetching notifications' });
  }
}
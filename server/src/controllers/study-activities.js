const db = require('../db');

exports.createStudyActivity = async (req, res) => {
  const { course_code, activity_type, activity_description, start_time, end_time } = req.body;
  const user_id = req.user.id;

  try {
    // Insert the activity for the user
    const userActivity = await db.query(
      'INSERT INTO study_activities(user_id, course_code, activity_type, activity_description, start_time, end_time) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, course_code, activity_type, activity_description, start_time, end_time]
    );

    // Find the partner
    const partnerResult = await db.query(
      'SELECT * FROM partners WHERE (partner_1_id = $1 OR partner_2_id = $1) AND course_code = $2',
      [user_id, course_code]
    );

    if (partnerResult.rows.length > 0) {
      const partner = partnerResult.rows[0];
      const partner_id = partner.partner_1_id === user_id ? partner.partner_2_id : partner.partner_1_id;

      // Insert the activity for the partner
      await db.query(
        'INSERT INTO study_activities(user_id, course_code, activity_type, activity_description, start_time, end_time) VALUES($1, $2, $3, $4, $5, $6)',
        [partner_id, course_code, activity_type, activity_description, start_time, end_time]
      );
    }

    res.status(201).json({ success: true, activity: userActivity.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudyActivities = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await db.query('SELECT * FROM study_activities WHERE user_id = $1', [user_id]);
    res.status(200).json({ success: true, activities: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudyActivity = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const result = await db.query('SELECT * FROM study_activities WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.status(200).json({ success: true, activity: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateStudyActivity = async (req, res) => {
  const { id } = req.params;
  const { activity_type, activity_description, start_time, end_time } = req.body;
  const user_id = req.user.id;

  try {
    const fetchResult = await db.query(
      'SELECT * FROM study_activities WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (fetchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const existingActivity = fetchResult.rows[0];

    const updatedActivity = {
      activity_type: activity_type || existingActivity.activity_type,
      activity_description: activity_description || existingActivity.activity_description,
      start_time: start_time || existingActivity.start_time,
      end_time: end_time || existingActivity.end_time,
    };

    const updateResult = await db.query(
      'UPDATE study_activities SET activity_type = $1, activity_description = $2, start_time = $3, end_time = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [updatedActivity.activity_type, updatedActivity.activity_description, updatedActivity.start_time, updatedActivity.end_time, id, user_id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Update the partner's activity if it exists
    const partnerResult = await db.query(
      'SELECT * FROM partners WHERE (partner_1_id = $1 OR partner_2_id = $1) AND course_code = (SELECT course_code FROM study_activities WHERE id = $2)',
      [user_id, id]
    );

    if (partnerResult.rows.length > 0) {
      const partner = partnerResult.rows[0];
      const partner_id = partner.partner_1_id === user_id ? partner.partner_2_id : partner.partner_1_id;

      await db.query(
        'UPDATE study_activities SET activity_type = $1, activity_description = $2, start_time = $3, end_time = $4 WHERE user_id = $5 AND id = $6',
        [updatedActivity.activity_type, updatedActivity.activity_description, updatedActivity.start_time, updatedActivity.end_time, partner_id, id]
      );
    }

    res.status(200).json({ success: true, activity: updateResult.rows[0] });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteStudyActivity = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const fetchResult = await db.query('SELECT * FROM study_activities WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (fetchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const deleteResult = await db.query('DELETE FROM study_activities WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Delete the partner's activity if it exists
    const partnerResult = await db.query(
      'SELECT * FROM partners WHERE (partner_1_id = $1 OR partner_2_id = $1) AND course_code = (SELECT course_code FROM study_activities WHERE id = $2)',
      [user_id, id]
    );

    if (partnerResult.rows.length > 0) {
      const partner = partnerResult.rows[0];
      const partner_id = partner.partner_1_id === user_id ? partner.partner_2_id : partner.partner_1_id;

      await db.query('DELETE FROM study_activities WHERE id = $1 AND user_id = $2', [id, partner_id]);
    }

    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.toggleActivityStatus = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const fetchResult = await db.query(
      'SELECT status FROM study_activities WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (fetchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const currentStatus = fetchResult.rows[0].status;
    const newStatus = !currentStatus;

    const updateResult = await db.query(
      'UPDATE study_activities SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [newStatus, id, user_id]
    );

    res.status(200).json({ success: true, activity: updateResult.rows[0] });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getDeadlines = async (req, res) => {
  const user_id = req.user.id;
  try {
    const result = await db.query('SELECT end_time FROM study_activities WHERE user_id = $1 ORDER BY end_time ASC RETURNING *', [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    res.status(500).json({ error: 'Failed to fetch deadlines' });
  }
};
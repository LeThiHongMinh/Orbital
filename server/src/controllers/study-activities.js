const db = require('../db');

exports.createStudyActivity = async (req, res) => {
  const { activity_type, activity_description, start_time, end_time } = req.body;
  const user_id = req.user.id; // User ID from authenticated user

  try {
    const result = await db.query(
      'INSERT INTO study_activities(user_id, activity_type, activity_description, start_time, end_time) VALUES($1, $2, $3, $4, $5) RETURNING *',
      [user_id, activity_type, activity_description, start_time, end_time]
    );
    res.status(201).json({ success: true, activity: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getStudyActivities = async (req, res) => {
  const user_id = req.user.id; // User ID from authenticated user

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
  const user_id = req.user.id; // User ID from authenticated user

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
  const user_id = req.user.id; // User ID from authenticated user

  try {
    // Fetch the existing activity first
    const fetchResult = await db.query(
      'SELECT * FROM study_activities WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (fetchResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const existingActivity = fetchResult.rows[0];

    // Update only the provided fields, keeping the existing values if not provided
    const updatedActivity = {
      activity_type: activity_type || existingActivity.activity_type,
      activity_description: activity_description || existingActivity.activity_description,
      start_time: start_time || existingActivity.start_time,
      end_time: end_time || existingActivity.end_time,
    };

    // Perform the update query
    const updateResult = await db.query(
      'UPDATE study_activities SET activity_type = $1, activity_description = $2, start_time = $3, end_time = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [updatedActivity.activity_type, updatedActivity.activity_description, updatedActivity.start_time, updatedActivity.end_time, id, user_id]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Return the updated activity
    res.status(200).json({ success: true, activity: updateResult.rows[0] });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.deleteStudyActivity = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id; // User ID from authenticated user

  try {
    const result = await db.query('DELETE FROM study_activities WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.status(200).json({ success: true, message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTasksForDate = async (req, res) => {
  const { selectedDate } = req.query; // Assuming selectedDate is provided in ISO format, e.g., '2024-05-15'
  const user_id = req.user.id; // User ID from authenticated user

  try {
    const result = await db.query(
      'SELECT * FROM study_activities WHERE user_id = $1 AND ($2 BETWEEN start_time::date AND end_time::date)',
      [user_id, selectedDate]
    );

    res.status(200).json({ success: true, activities: result.rows });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

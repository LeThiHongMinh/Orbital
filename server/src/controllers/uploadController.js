const db = require('../db')

exports.uploadLibrary = async (req, res) => {
    try {
      const { name, description } = req.body;
      const fileData = req.file.buffer;
  
      // Store file info and content into PostgreSQL
      const client = await db.connect();
      const result = await client.query(
        'INSERT INTO files (name, description, file_data) VALUES ($1, $2, $3) RETURNING id',
        [name, description, fileData]
      );
      const fileId = result.rows[0].id;
      client.release();
  
      res.json({ success: true, fileId });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ success: false, error: 'Error uploading file' });
    }
  };
  
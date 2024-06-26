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
  
exports.searchFiles = async (req, res) => {
    try {
      const { query } = req.query;
      const client = await db.connect();
      const result = await client.query(
        'SELECT id, name, description FROM files WHERE name ILIKE $1 OR description ILIKE $1',
        [`%${query}%`]
      );
      client.release();
      res.json(result.rows);
    } catch (error) {
      console.error('Error searching files:', error);
      res.status(500).json({ success: false, error: 'Error searching files' });
    }
};

exports.getLibraryFiles = async (req, res) => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT id, name, description, file_data FROM files');
    client.release();

    res.json({ success: true, files: result.rows });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ success: false, error: 'Error fetching files' });
  }
};

exports.downloadFiles = async (req, res) => {
  const fileId = req.params.id;
  try {
    const client = await db.connect();
    const result = await client.query('SELECT name, file_data FROM files WHERE id = $1', [fileId]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    const file = result.rows[0];
    const fileBuffer = Buffer.from(file.file_data, 'base64'); // Assuming file_data is stored as base64 encoded string

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}.pdf"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ success: false, error: 'Error fetching file' });
  }
};
const pool = require('../../config/database');

const User = {
  async create({ email, password_hash, full_name, phone, role_id }) {
    const query = `
      INSERT INTO users (email, password_hash, full_name, phone, role_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, full_name, phone, role_id
    `;
    const values = [email, password_hash, full_name, phone, role_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findById(id) {
    // Đổi role thành role_id
    const query = `SELECT id, email, full_name, phone, role_id FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = User;
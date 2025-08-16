const database = require('../config/database');

class Member {
    static async create(memberData) {
        const {
            fullName,
            email,
            phone,
            department,
            year,
            experience = '',
            motivation = ''
        } = memberData;

        const sql = `
            INSERT INTO members (full_name, email, phone, department, year, experience, motivation)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            const result = await database.run(sql, [
                fullName, email, phone, department, year, experience, motivation
            ]);
            return { id: result.id, ...memberData };
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    static async findAll(status = null) {
        let sql = 'SELECT * FROM members';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        return await database.query(sql, params);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM members WHERE id = ?';
        return await database.get(sql, [id]);
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM members WHERE email = ?';
        return await database.get(sql, [email]);
    }

    static async updateStatus(id, status) {
        const sql = `
            UPDATE members 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `;
        return await database.run(sql, [status, id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM members WHERE id = ?';
        return await database.run(sql, [id]);
    }

    static async getStats() {
        const totalQuery = 'SELECT COUNT(*) as total FROM members';
        const approvedQuery = 'SELECT COUNT(*) as approved FROM members WHERE status = "approved"';
        const pendingQuery = 'SELECT COUNT(*) as pending FROM members WHERE status = "pending"';
        const departmentQuery = `
            SELECT department, COUNT(*) as count 
            FROM members 
            WHERE status = "approved" 
            GROUP BY department
        `;

        const [total, approved, pending, departments] = await Promise.all([
            database.get(totalQuery),
            database.get(approvedQuery),
            database.get(pendingQuery),
            database.query(departmentQuery)
        ]);

        return {
            total: total.total,
            approved: approved.approved,
            pending: pending.pending,
            departments
        };
    }
}

module.exports = Member;
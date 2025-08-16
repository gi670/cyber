const database = require('../config/database');

class Contact {
    static async create(contactData) {
        const { name, email, subject, message } = contactData;

        const sql = `
            INSERT INTO contact_messages (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        `;

        const result = await database.run(sql, [name, email, subject, message]);
        return { id: result.id, ...contactData, status: 'unread' };
    }

    static async findAll(status = null) {
        let sql = 'SELECT * FROM contact_messages';
        let params = [];

        if (status) {
            sql += ' WHERE status = ?';
            params.push(status);
        }

        sql += ' ORDER BY created_at DESC';

        return await database.query(sql, params);
    }

    static async findById(id) {
        const sql = 'SELECT * FROM contact_messages WHERE id = ?';
        return await database.get(sql, [id]);
    }

    static async markAsRead(id) {
        const sql = `
            UPDATE contact_messages 
            SET status = 'read' 
            WHERE id = ?
        `;
        return await database.run(sql, [id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM contact_messages WHERE id = ?';
        return await database.run(sql, [id]);
    }

    static async getStats() {
        const totalQuery = 'SELECT COUNT(*) as total FROM contact_messages';
        const unreadQuery = 'SELECT COUNT(*) as unread FROM contact_messages WHERE status = "unread"';

        const [total, unread] = await Promise.all([
            database.get(totalQuery),
            database.get(unreadQuery)
        ]);

        return {
            total: total.total,
            unread: unread.unread,
            read: total.total - unread.unread
        };
    }
}

module.exports = Contact;
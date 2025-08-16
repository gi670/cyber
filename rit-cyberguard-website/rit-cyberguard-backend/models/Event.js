const database = require('../config/database');

class Event {
    static async create(eventData) {
        const { name, description, schedule, location, maxParticipants } = eventData;

        const sql = `
            INSERT INTO events (name, description, schedule, location, max_participants)
            VALUES (?, ?, ?, ?, ?)
        `;

        const result = await database.run(sql, [
            name, description, schedule, location, maxParticipants
        ]);

        return { id: result.id, ...eventData };
    }

    static async findAll(status = null) {
        let sql = `
            SELECT e.*, 
                   COUNT(er.id) as registered_count
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
        `;
        let params = [];

        if (status) {
            sql += ' WHERE e.status = ?';
            params.push(status);
        }

        sql += ' GROUP BY e.id ORDER BY e.schedule ASC';

        return await database.query(sql, params);
    }

    static async findById(id) {
        const sql = `
            SELECT e.*, 
                   COUNT(er.id) as registered_count
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id
            WHERE e.id = ?
            GROUP BY e.id
        `;
        return await database.get(sql, [id]);
    }

    static async register(eventId, registrationData) {
        const { name, email, phone, department, year } = registrationData;

        // Check if already registered
        const existingReg = await database.get(
            'SELECT id FROM event_registrations WHERE event_id = ? AND email = ?',
            [eventId, email]
        );

        if (existingReg) {
            throw new Error('Already registered for this event');
        }

        // Check event capacity
        const event = await this.findById(eventId);
        if (event.max_participants && event.registered_count >= event.max_participants) {
            throw new Error('Event is full');
        }

        const sql = `
            INSERT INTO event_registrations (event_id, name, email, phone, department, year)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const result = await database.run(sql, [
            eventId, name, email, phone, department, year
        ]);

        return { id: result.id, eventId, ...registrationData };
    }

    static async getRegistrations(eventId) {
        const sql = `
            SELECT * FROM event_registrations 
            WHERE event_id = ? 
            ORDER BY created_at ASC
        `;
        return await database.query(sql, [eventId]);
    }

    static async updateStatus(id, status) {
        const sql = 'UPDATE events SET status = ? WHERE id = ?';
        return await database.run(sql, [status, id]);
    }

    static async delete(id) {
        const sql = 'DELETE FROM events WHERE id = ?';
        return await database.run(sql, [id]);
    }
}

module.exports = Event;
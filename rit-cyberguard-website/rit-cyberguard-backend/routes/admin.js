const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const database = require('../config/database');
const Member = require('../models/Member');
const Contact = require('../models/Contact');
const Event = require('../models/Event');

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

// Admin login validation
const loginValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

// POST /api/admin/login - Admin login
router.post('/login', loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        // Find admin user
        const admin = await database.get(
            'SELECT * FROM admin_users WHERE username = ?',
            [username]
        );

        if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await database.run(
            'UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
            [admin.id]
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                admin: {
                    id: admin.id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            }
        });

    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
});

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
        const [memberStats, contactStats] = await Promise.all([
            Member.getStats(),
            Contact.getStats()
        ]);

        // Get recent activities
        const recentMembers = await database.query(
            'SELECT full_name, email, created_at FROM members ORDER BY created_at DESC LIMIT 5'
        );

        const recentContacts = await database.query(
            'SELECT name, subject, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'
        );

        const upcomingEvents = await database.query(
            `SELECT name, schedule, location 
             FROM events 
             WHERE schedule > datetime('now') 
             ORDER BY schedule ASC LIMIT 5`
        );

        res.json({
            success: true,
            data: {
                statistics: {
                    members: memberStats,
                    contacts: contactStats,
                    events: {
                        upcoming: upcomingEvents.length,
                        total: await database.get('SELECT COUNT(*) as count FROM events').then(r => r.count)
                    }
                },
                recentActivity: {
                    members: recentMembers,
                    contacts: recentContacts,
                    events: upcomingEvents
                }
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
});

// POST /api/admin/events - Create new event (admin only)
router.post('/events', authenticateAdmin, [
    body('name').notEmpty().withMessage('Event name is required'),
    body('schedule').isISO8601().withMessage('Valid date/time is required'),
    body('location').notEmpty().withMessage('Location is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const event = await Event.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });

    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event'
        });
    }
});

// PUT /api/admin/events/:id - Update event
router.put('/events/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, schedule, location, maxParticipants, status } = req.body;

        const result = await database.run(
            `UPDATE events 
             SET name = ?, description = ?, schedule = ?, location = ?, max_participants = ?, status = ?
             WHERE id = ?`,
            [name, description, schedule, location, maxParticipants, status, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event updated successfully'
        });

    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event'
        });
    }
});

// DELETE /api/admin/events/:id - Delete event
router.delete('/events/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await database.run('DELETE FROM events WHERE id = ?', [id]);

        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event'
        });
    }
});

// GET /api/admin/export/members - Export members data
router.get('/export/members', authenticateAdmin, async (req, res) => {
    try {
        const members = await Member.findAll();

        // Convert to CSV format
        const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Department', 'Year', 'Status', 'Created At'];
        const csvData = [
            headers.join(','),
            ...members.map(member => [
                member.id,
                `"${member.full_name}"`,
                member.email,
                member.phone,
                member.department,
                member.year,
                member.status,
                member.created_at
            ].join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=members.csv');
        res.send(csvData);

    } catch (error) {
        console.error('Error exporting members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export members'
        });
    }
});

module.exports = router;
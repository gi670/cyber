const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Event = require('../models/Event');
const { sendEmail } = require('../utils/emailService');

// Validation for event registration
const registrationValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('phone')
        .optional()
        .matches(/^[\+]?[1-9]?[0-9]{7,15}$/)
        .withMessage('Valid phone number is required'),

    body('department')
        .optional()
        .notEmpty()
        .withMessage('Department cannot be empty if provided'),

    body('year')
        .optional()
        .isInt({ min: 1, max: 4 })
        .withMessage('Year must be between 1 and 4')
];

// GET /api/events - Get all events
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const events = await Event.findAll(status);

        res.json({
            success: true,
            data: events,
            count: events.length
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch events'
        });
    }
});

// GET /api/events/:id - Get specific event
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event'
        });
    }
});

// POST /api/events/register - Register for an event
router.post('/register', registrationValidation, async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { eventId, ...registrationData } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Register for event
        const registration = await Event.register(eventId, registrationData);

        // Send confirmation email to participant
        const confirmationEmailHtml = `
            <h2>Event Registration Confirmed!</h2>
            <p>Dear ${registration.name},</p>
            <p>You have successfully registered for the following event:</p>

            <h3>Event Details:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #F76902;">
                <p><strong>Event:</strong> ${event.name}</p>
                <p><strong>Date & Time:</strong> ${new Date(event.schedule).toLocaleString()}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <p><strong>Description:</strong> ${event.description}</p>
            </div>

            <h3>Important Notes:</h3>
            <ul>
                <li>Please arrive 10 minutes before the event starts</li>
                <li>Bring your laptop and any required materials</li>
                <li>Contact us if you need to cancel your registration</li>
            </ul>

            <p>If you have any questions, feel free to contact us at cyberguard@ritrjpm.ac.in</p>

            <p><strong>Security Through Innovation</strong></p>
            <p>RIT CyberGuard Team</p>
        `;

        await sendEmail({
            to: registration.email,
            subject: `Registration Confirmed: ${event.name}`,
            html: confirmationEmailHtml
        });

        // Send notification to admin
        const adminNotificationHtml = `
            <h2>New Event Registration</h2>
            <p>A new participant has registered for an event.</p>

            <h3>Event:</h3>
            <p><strong>${event.name}</strong> - ${new Date(event.schedule).toLocaleString()}</p>

            <h3>Participant Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${registration.name}</li>
                <li><strong>Email:</strong> ${registration.email}</li>
                <li><strong>Phone:</strong> ${registration.phone || 'Not provided'}</li>
                <li><strong>Department:</strong> ${registration.department || 'Not provided'}</li>
                <li><strong>Year:</strong> ${registration.year || 'Not provided'}</li>
            </ul>

            <p>Current registrations: ${event.registered_count + 1}/${event.max_participants || 'Unlimited'}</p>
        `;

        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'cyberguard@ritrjpm.ac.in',
            subject: `New Registration: ${event.name}`,
            html: adminNotificationHtml
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful! Check your email for confirmation.',
            data: {
                registrationId: registration.id,
                eventName: event.name,
                eventDate: event.schedule
            }
        });

    } catch (error) {
        console.error('Error registering for event:', error);

        if (error.message === 'Already registered for this event') {
            return res.status(409).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        if (error.message === 'Event is full') {
            return res.status(400).json({
                success: false,
                message: 'This event has reached its maximum capacity'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to register for event. Please try again later.'
        });
    }
});

// GET /api/events/:id/registrations - Get event registrations (admin only)
router.get('/:id/registrations', async (req, res) => {
    try {
        const { id } = req.params;
        const registrations = await Event.getRegistrations(id);

        res.json({
            success: true,
            data: registrations,
            count: registrations.length
        });
    } catch (error) {
        console.error('Error fetching event registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch registrations'
        });
    }
});

module.exports = router;
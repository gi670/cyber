const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendEmail } = require('../utils/emailService');

// Validation rules for contact form
const contactValidation = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('subject')
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ min: 5, max: 200 })
        .withMessage('Subject must be between 5 and 200 characters'),

    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Message must be between 10 and 2000 characters')
];

// POST /api/contact - Submit contact form
router.post('/', contactValidation, async (req, res) => {
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

        // Create contact record
        const contact = await Contact.create(req.body);

        // Send acknowledgment email to user
        const userEmailHtml = `
            <h2>Thank you for contacting RIT CyberGuard</h2>
            <p>Dear ${contact.name},</p>
            <p>We have received your message and will respond within 24 hours.</p>

            <h3>Your Message:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #F76902;">
                <p><strong>Subject:</strong> ${contact.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${contact.message}</p>
            </div>

            <p>If your inquiry is urgent, you can also reach us at:</p>
            <ul>
                <li>Phone: +91 9489634752</li>
                <li>Email: cyberguard@ritrjpm.ac.in</li>
            </ul>

            <p><strong>Security Through Innovation</strong></p>
            <p>RIT CyberGuard Team</p>
        `;

        await sendEmail({
            to: contact.email,
            subject: 'Message Received - RIT CyberGuard',
            html: userEmailHtml
        });

        // Send notification to admin
        const adminEmailHtml = `
            <h2>New Contact Form Submission</h2>
            <p>You have received a new message from the RIT CyberGuard website.</p>

            <h3>Contact Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${contact.name}</li>
                <li><strong>Email:</strong> ${contact.email}</li>
                <li><strong>Subject:</strong> ${contact.subject}</li>
            </ul>

            <h3>Message:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #00B4D8;">
                <p>${contact.message}</p>
            </div>

            <p>Please respond to this inquiry promptly.</p>
            <p><em>This message was sent from the RIT CyberGuard website contact form.</em></p>
        `;

        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'cyberguard@ritrjpm.ac.in',
            subject: `New Contact Form: ${contact.subject}`,
            html: adminEmailHtml,
            replyTo: contact.email
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! We will respond within 24 hours.',
            data: {
                id: contact.id,
                name: contact.name,
                email: contact.email,
                subject: contact.subject
            }
        });

    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// GET /api/contact - Get all contact messages (admin only)
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const messages = await Contact.findAll(status);

        res.json({
            success: true,
            data: messages,
            count: messages.length
        });
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages'
        });
    }
});

// GET /api/contact/stats - Get contact statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Contact.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching contact stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// PUT /api/contact/:id/read - Mark message as read (admin only)
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        const message = await Contact.findById(id);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        await Contact.markAsRead(id);

        res.json({
            success: true,
            message: 'Message marked as read',
            data: { id }
        });

    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update message status'
        });
    }
});

module.exports = router;
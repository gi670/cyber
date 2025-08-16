const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Member = require('../models/Member');
const { sendEmail } = require('../utils/emailService');

// Validation rules for member registration
const memberValidation = [
    body('fullName')
        .notEmpty()
        .withMessage('Full name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),

    body('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^[\+]?[1-9]?[0-9]{7,15}$/)
        .withMessage('Valid phone number is required'),

    body('department')
        .notEmpty()
        .withMessage('Department is required'),

    body('year')
        .isInt({ min: 1, max: 4 })
        .withMessage('Year must be between 1 and 4')
];

// POST /api/members/join - Submit membership application
router.post('/join', memberValidation, async (req, res) => {
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

        // Create member record
        const member = await Member.create(req.body);

        // Send welcome email to applicant
        const welcomeEmailHtml = `
            <h2>Welcome to RIT CyberGuard!</h2>
            <p>Dear ${member.fullName},</p>
            <p>Thank you for your interest in joining RIT CyberGuard. We have received your application and our team will review it shortly.</p>

            <h3>Application Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${member.fullName}</li>
                <li><strong>Email:</strong> ${member.email}</li>
                <li><strong>Department:</strong> ${member.department}</li>
                <li><strong>Year:</strong> ${member.year}</li>
            </ul>

            <p>We will contact you within 2-3 business days regarding the status of your application.</p>

            <p>In the meantime, feel free to:</p>
            <ul>
                <li>Follow us on our social media channels</li>
                <li>Attend our weekly meetings (Wednesdays 4:00 PM at Computer Science Lab)</li>
                <li>Join our community events</li>
            </ul>

            <p><strong>Security Through Innovation</strong></p>
            <p>RIT CyberGuard Team</p>
        `;

        await sendEmail({
            to: member.email,
            subject: 'Welcome to RIT CyberGuard - Application Received',
            html: welcomeEmailHtml
        });

        // Send notification to admin
        const adminNotificationHtml = `
            <h2>New Membership Application</h2>
            <p>A new student has applied to join RIT CyberGuard.</p>

            <h3>Applicant Details:</h3>
            <ul>
                <li><strong>Name:</strong> ${member.fullName}</li>
                <li><strong>Email:</strong> ${member.email}</li>
                <li><strong>Phone:</strong> ${member.phone}</li>
                <li><strong>Department:</strong> ${member.department}</li>
                <li><strong>Year:</strong> ${member.year}</li>
                <li><strong>Experience:</strong> ${member.experience || 'Not provided'}</li>
                <li><strong>Motivation:</strong> ${member.motivation || 'Not provided'}</li>
            </ul>

            <p>Please review this application in the admin panel.</p>
        `;

        await sendEmail({
            to: process.env.ADMIN_EMAIL || 'cyberguard@ritrjpm.ac.in',
            subject: 'New RIT CyberGuard Membership Application',
            html: adminNotificationHtml
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! You will hear back from us within 2-3 business days.',
            data: {
                id: member.id,
                fullName: member.fullName,
                email: member.email,
                status: 'pending'
            }
        });

    } catch (error) {
        console.error('Error submitting membership application:', error);

        if (error.message === 'Email already exists') {
            return res.status(409).json({
                success: false,
                message: 'An application with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to submit application. Please try again later.'
        });
    }
});

// GET /api/members - Get all members (admin only)
router.get('/', async (req, res) => {
    try {
        const { status } = req.query;
        const members = await Member.findAll(status);

        res.json({
            success: true,
            data: members,
            count: members.length
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch members'
        });
    }
});

// GET /api/members/stats - Get membership statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await Member.getStats();
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching member stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics'
        });
    }
});

// PUT /api/members/:id/status - Update member status (admin only)
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be approved, rejected, or pending'
            });
        }

        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        await Member.updateStatus(id, status);

        // Send status update email
        let emailSubject, emailHtml;

        if (status === 'approved') {
            emailSubject = 'Welcome to RIT CyberGuard - Application Approved! 🎉';
            emailHtml = `
                <h2>Congratulations! You're now part of RIT CyberGuard!</h2>
                <p>Dear ${member.full_name},</p>
                <p>We are excited to inform you that your application to join RIT CyberGuard has been <strong>approved</strong>!</p>

                <h3>Next Steps:</h3>
                <ul>
                    <li>Join our WhatsApp group: [Link will be provided separately]</li>
                    <li>Attend our next meeting: Every Wednesday at 4:00 PM, Computer Science Lab</li>
                    <li>Choose your team: Red Team, Blue Team, Forensics, or Research</li>
                    <li>Set up your learning environment</li>
                </ul>

                <p>We look forward to seeing you at our next meeting!</p>
                <p><strong>Security Through Innovation</strong></p>
                <p>RIT CyberGuard Team</p>
            `;
        } else if (status === 'rejected') {
            emailSubject = 'RIT CyberGuard Application Update';
            emailHtml = `
                <h2>Thank you for your interest in RIT CyberGuard</h2>
                <p>Dear ${member.full_name},</p>
                <p>Thank you for applying to join RIT CyberGuard. After careful consideration, we are unable to accept your application at this time.</p>
                <p>However, we encourage you to:</p>
                <ul>
                    <li>Attend our public workshops and events</li>
                    <li>Gain more experience in cybersecurity</li>
                    <li>Apply again in the future</li>
                </ul>
                <p>We appreciate your interest and wish you the best in your cybersecurity journey.</p>
                <p>RIT CyberGuard Team</p>
            `;
        }

        if (emailSubject && emailHtml) {
            await sendEmail({
                to: member.email,
                subject: emailSubject,
                html: emailHtml
            });
        }

        res.json({
            success: true,
            message: `Member status updated to ${status}`,
            data: { id, status }
        });

    } catch (error) {
        console.error('Error updating member status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update member status'
        });
    }
});

module.exports = router;
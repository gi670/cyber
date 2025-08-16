const bcrypt = require('bcryptjs');
const database = require('../config/database');

// Initialize database and create default admin user
async function initializeDatabase() {
    try {
        console.log('🔧 Initializing database...');

        // Connect to database
        await database.connect();

        // Check if admin user exists
        const adminExists = await database.get(
            'SELECT id FROM admin_users WHERE username = ?',
            ['admin']
        );

        if (!adminExists) {
            console.log('👤 Creating default admin user...');

            // Create default admin user
            const defaultPassword = 'admin123'; // Change this in production!
            const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

            await database.run(
                `INSERT INTO admin_users (username, password_hash, email, role)
                 VALUES (?, ?, ?, ?)`,
                ['admin', hashedPassword, 'admin@ritrjpm.ac.in', 'admin']
            );

            console.log('✅ Default admin user created');
            console.log('📧 Username: admin');
            console.log('🔑 Password: admin123');
            console.log('⚠️  Please change the default password in production!');
        }

        // Insert sample teams
        const teamsExist = await database.get('SELECT id FROM teams LIMIT 1');
        if (!teamsExist) {
            console.log('👥 Creating sample teams...');

            const teams = [
                {
                    name: 'Red Team',
                    description: 'Offensive security specialists focusing on penetration testing, vulnerability assessment, and ethical hacking.',
                    meeting_time: 'Fridays 3:00 PM'
                },
                {
                    name: 'Blue Team',
                    description: 'Defensive cybersecurity experts specializing in incident response, threat hunting, and security monitoring.',
                    meeting_time: 'Thursdays 4:00 PM'
                },
                {
                    name: 'Forensics Team',
                    description: 'Digital forensics and incident analysis specialists. Learn to investigate cybercrimes and analyze malware.',
                    meeting_time: 'Tuesdays 5:00 PM'
                },
                {
                    name: 'Research Team',
                    description: 'Academic research in emerging cybersecurity technologies, AI security, and IoT vulnerabilities.',
                    meeting_time: 'Mondays 2:00 PM'
                }
            ];

            for (const team of teams) {
                await database.run(
                    `INSERT INTO teams (name, description, meeting_time) VALUES (?, ?, ?)`,
                    [team.name, team.description, team.meeting_time]
                );
            }

            console.log('✅ Sample teams created');
        }

        // Insert sample activities
        const activitiesExist = await database.get('SELECT id FROM activities LIMIT 1');
        if (!activitiesExist) {
            console.log('🎯 Creating sample activities...');

            const activities = [
                {
                    name: 'Capture The Flag (CTF)',
                    description: 'Weekly CTF challenges covering web exploitation, cryptography, reverse engineering, and more.',
                    frequency: 'WEEKLY'
                },
                {
                    name: 'Security Workshops',
                    description: 'Hands-on workshops on topics like network security, malware analysis, secure coding, and vulnerability assessment.',
                    frequency: 'BI-WEEKLY'
                },
                {
                    name: 'Industry Talks',
                    description: 'Guest lectures from cybersecurity professionals, alumni, and industry experts sharing real-world experiences.',
                    frequency: 'MONTHLY'
                },
                {
                    name: 'Certification Prep',
                    description: 'Study groups for popular cybersecurity certifications including CEH, Security+, CISSP, and more.',
                    frequency: 'ONGOING'
                },
                {
                    name: 'Hackathons',
                    description: 'Organize and participate in cybersecurity hackathons, both internal competitions and external events.',
                    frequency: 'QUARTERLY'
                },
                {
                    name: 'Community Outreach',
                    description: 'Cybersecurity awareness programs for local schools, businesses, and community organizations.',
                    frequency: 'MONTHLY'
                }
            ];

            for (const activity of activities) {
                await database.run(
                    `INSERT INTO activities (name, description, frequency) VALUES (?, ?, ?)`,
                    [activity.name, activity.description, activity.frequency]
                );
            }

            console.log('✅ Sample activities created');
        }

        // Insert sample events
        const eventsExist = await database.get('SELECT id FROM events LIMIT 1');
        if (!eventsExist) {
            console.log('📅 Creating sample events...');

            const events = [
                {
                    name: 'Club Introduction & Welcome',
                    description: 'Welcome new members and introduce them to RIT CyberGuard. Learn about our mission, activities, and how to get involved.',
                    schedule: '2025-08-20 18:00:00',
                    location: 'Computer Science Lab',
                    max_participants: 50
                },
                {
                    name: 'Beginner\'s Guide to Cybersecurity',
                    description: 'Foundational workshop covering cybersecurity basics, career paths, and essential tools for newcomers.',
                    schedule: '2025-08-25 16:00:00',
                    location: 'Seminar Hall A',
                    max_participants: 30
                },
                {
                    name: 'CTF Training Session',
                    description: 'Hands-on training for Capture The Flag competitions. Learn problem-solving techniques and tool usage.',
                    schedule: '2025-09-01 15:00:00',
                    location: 'Computer Lab 2',
                    max_participants: 25
                },
                {
                    name: 'Industry Expert Talk',
                    description: 'Guest lecture by a leading cybersecurity professional discussing current threats and industry trends.',
                    schedule: '2025-09-08 17:00:00',
                    location: 'Main Auditorium',
                    max_participants: 100
                }
            ];

            for (const event of events) {
                await database.run(
                    `INSERT INTO events (name, description, schedule, location, max_participants) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [event.name, event.description, event.schedule, event.location, event.max_participants]
                );
            }

            console.log('✅ Sample events created');
        }

        console.log('🎉 Database initialization completed successfully!');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase().then(() => {
        console.log('✅ Database initialization script completed');
        process.exit(0);
    });
}

module.exports = { initializeDatabase };
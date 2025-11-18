var mysql = require('mysql');
require('dotenv').config();
var connection = require('../config/conn')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendCredentials, sendPasswordReset } = require('../services/emailService');

const secretKey = process.env.SECRET_KEY;

// Generate unique volunteer ID (updated to promise style)
const generateVolunteerID = async (course, year) => {
    try {
        const currentYear = new Date().getFullYear();
        let prefix = 'TE'; // Default for other courses
        
        if (course.toLowerCase() === 'btech') {
            prefix = 'BE';
        } else if (course.toLowerCase() === 'mtech') {
            prefix = 'MT';
        }
        
        const baseId = `${prefix}${currentYear}`;
        const query = `SELECT COUNT(*) as count FROM volunteers WHERE volunteer_id LIKE '${baseId}%'`;
        
        const [response] = await connection.execute(query);
        const count = response[0].count + 1;
        const volunteerId = `${baseId}${count.toString().padStart(3, '0')}`;
        return volunteerId;
    } catch (error) {
        console.error('Error generating volunteer ID:', error);
        return 'BE2024001'; // Fallback
    }
};

module.exports.registerVolunteer = async (req, res) => {
    try {
        console.log("🎯 Inside Volunteer Registration Controller");
        const { roll, name, course, email, contact, branch, year, semester, password } = req.body;
        
        // Check if volunteer already exists
        const [existingVolunteers] = await connection.execute(
            'SELECT * FROM volunteers WHERE roll = ? OR email = ?', 
            [roll, email]
        );
        
        if (existingVolunteers.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: "Volunteer is already registered." 
            });
        }

        const volunteerId = await generateVolunteerID(course, year);
        const salt = await bcrypt.genSaltSync(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        
        const volunteerData = {
            volunteer_id: volunteerId,
            roll: roll,
            name: name,
            email: email,
            contact: contact,
            course: course,
            year: year,
            branch: branch,
            semester: semester,
            password: hashedPwd
        };

        const query = `INSERT INTO volunteers 
                      (volunteer_id, roll, name, email, contact, course, year, branch, semester, password) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [result] = await connection.execute(query, [
            volunteerId, roll, name, email, contact, course, year, branch, semester, hashedPwd
        ]);

        console.log("✅ Volunteer registered successfully with ID:", volunteerId);
        
        // Send welcome email with credentials (fire and forget)
        // sendCredentials(email, volunteerId, password, name).catch(console.error);
        
        const tokenData = { ...volunteerData };
        delete tokenData.password;
        const token = jwt.sign(tokenData, secretKey);
        
        return res.status(200).json({ 
            success: true,
            message: "Registered Successfully!",
            data: {
                token: token,
                volunteerId: volunteerId,
                volunteer: tokenData
            }
        });

    } catch (error) {
        console.log("❌ Database Error in registerVolunteer:", error);
        return res.status(500).json({ 
            success: false,
            message: "Registration failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.bulkRegisterVolunteers = async (req, res) => {
    try {
        console.log("📦 Inside Bulk Volunteer Registration");
        const volunteers = req.body.volunteers;
        const results = {
            successful: [],
            failed: []
        };

        for (const volunteer of volunteers) {
            try {
                const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
                const volunteerId = await generateVolunteerID(volunteer.course, volunteer.year);
                const salt = await bcrypt.genSaltSync(10);
                const hashedPwd = await bcrypt.hash(tempPassword, salt);
                
                const query = `INSERT INTO volunteers 
                              (volunteer_id, roll, name, email, contact, course, year, branch, semester, password) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                
                await connection.execute(query, [
                    volunteerId,
                    volunteer.roll,
                    volunteer.name,
                    volunteer.email,
                    volunteer.contact,
                    volunteer.course,
                    volunteer.year,
                    volunteer.branch,
                    volunteer.semester,
                    hashedPwd
                ]);

                // Send credentials email (fire and forget)
                // sendCredentials(volunteer.email, volunteerId, tempPassword, volunteer.name).catch(console.error);
                
                results.successful.push({
                    name: volunteer.name,
                    email: volunteer.email,
                    volunteerId: volunteerId
                });
            } catch (error) {
                results.failed.push({
                    name: volunteer.name,
                    email: volunteer.email,
                    error: error.message
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: `Bulk registration completed. Successful: ${results.successful.length}, Failed: ${results.failed.length}`,
            data: results
        });

    } catch (error) {
        console.log("❌ Database Error in bulkRegisterVolunteers:", error);
        return res.status(500).json({ 
            success: false,
            message: "Bulk registration failed.",
            error: error.message
        });
    }
};

module.exports.loginVolunteer = async (req, res) => {
    try {
        console.log("🔐 Inside Volunteer Login Controller");
        const { roll, password } = req.body;
        
        const [volunteers] = await connection.execute(
            'SELECT * FROM volunteers WHERE roll = ?', 
            [roll]
        );

        if (volunteers.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: "Volunteer not registered!" 
            });
        }

        const volunteer = volunteers[0];
        const pwdCheck = await bcrypt.compare(password, volunteer.password);
        
        if (!pwdCheck) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid Credentials" 
            });
        }

        const { password: _, ...volunteerData } = volunteer;
        const token = jwt.sign(volunteerData, secretKey);
        
        console.log("✅ Volunteer logged in successfully:", roll);
        
        return res.status(200).json({ 
            success: true,
            message: "Logged in successfully!", 
            data: {
                token: token,
                volunteer: volunteerData
            }
        });

    } catch (error) {
        console.log("❌ Database Error in loginVolunteer:", error);
        return res.status(500).json({ 
            success: false,
            message: "Login failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.getVolunteerActivities = async (req, res) => {
    try {
        console.log("📋 Inside Get Volunteer Activities");
        const { branch, semester, course, year } = req.body;
        
        const query = `SELECT * FROM activities WHERE activity_date >= CURDATE() ORDER BY activity_date ASC`;
        
        const [activities] = await connection.execute(query);

        return res.status(200).json({ 
            success: true,
            data: activities 
        });

    } catch (error) {
        console.log("❌ Database Error in getVolunteerActivities:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching activities",
            error: error.message
        });
    }
};

module.exports.getMyAttendance = async (req, res) => {
    try {
        console.log("📊 Inside Get My Attendance");
        const { volunteer_id } = req.body;
        
        const query = `
            SELECT a.*, aa.status, aa.date as attendance_date 
            FROM activities a 
            LEFT JOIN activity_attendance aa ON a.id = aa.activity_id AND aa.volunteer_id = ?
            WHERE a.activity_date <= CURDATE()
            ORDER BY a.activity_date DESC
        `;
        
        const [attendance] = await connection.execute(query, [volunteer_id]);

        return res.status(200).json({ 
            success: true,
            data: attendance 
        });

    } catch (error) {
        console.log("❌ Database Error in getMyAttendance:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching attendance records",
            error: error.message
        });
    }
};

module.exports.getMyWork = async (req, res) => {
    try {
        console.log("💼 Inside Get My Work");
        const { volunteer_id } = req.body;
        
        const query = `SELECT * FROM individual_work WHERE volunteer_id = ? ORDER BY work_date DESC`;
        
        const [work] = await connection.execute(query, [volunteer_id]);

        return res.status(200).json({ 
            success: true,
            data: work 
        });

    } catch (error) {
        console.log("❌ Database Error in getMyWork:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching work records",
            error: error.message
        });
    }
};

module.exports.getMyStatistics = async (req, res) => {
    try {
        console.log("📈 Inside Get My Statistics");
        const { volunteer_id } = req.body;
        
        // Calculate activity hours
        const activityQuery = `
            SELECT COALESCE(SUM(a.duration_hours), 0) as total_activity_hours,
                   COUNT(aa.id) as activities_attended
            FROM activity_attendance aa
            JOIN activities a ON aa.activity_id = a.id
            WHERE aa.volunteer_id = ? AND aa.status = 'present'
        `;
        
        // Calculate individual work hours
        const workQuery = `
            SELECT COALESCE(SUM(hours_spent), 0) as total_work_hours,
                   work_type,
                   COUNT(*) as work_count
            FROM individual_work 
            WHERE volunteer_id = ?
            GROUP BY work_type
        `;
        
        const [activityResult] = await connection.execute(activityQuery, [volunteer_id]);
        const [workResult] = await connection.execute(workQuery, [volunteer_id]);
        
        const activityStats = activityResult[0];
        const workStats = workResult.reduce((acc, curr) => {
            acc.total_work_hours += parseFloat(curr.total_work_hours);
            acc.breakdown = acc.breakdown || {};
            acc.breakdown[curr.work_type] = {
                hours: parseFloat(curr.total_work_hours),
                count: curr.work_count
            };
            return acc;
        }, { total_work_hours: 0, breakdown: {} });
        
        const totalHours = parseFloat(activityStats.total_activity_hours) + workStats.total_work_hours;
        
        return res.status(200).json({ 
            success: true,
            data: {
                total_hours: totalHours,
                activity_hours: parseFloat(activityStats.total_activity_hours),
                work_hours: workStats.total_work_hours,
                activities_attended: activityStats.activities_attended,
                work_breakdown: workStats.breakdown
            }
        });

    } catch (error) {
        console.log("❌ Database Error in getMyStatistics:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error calculating statistics",
            error: error.message
        });
    }
};

module.exports.changePassword = async (req, res) => {
    try {
        console.log("🔑 Inside Change Password");
        const { volunteer_id, currentPassword, newPassword } = req.body;
        
        // Verify current password
        const [volunteers] = await connection.execute(
            'SELECT * FROM volunteers WHERE volunteer_id = ?', 
            [volunteer_id]
        );

        if (volunteers.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Volunteer not found!" 
            });
        }
        
        const volunteer = volunteers[0];
        const pwdCheck = await bcrypt.compare(currentPassword, volunteer.password);
        
        if (!pwdCheck) {
            return res.status(401).json({ 
                success: false,
                message: "Current password is incorrect!" 
            });
        }
        
        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: "Password must be at least 8 characters long!" 
            });
        }
        
        // Hash new password
        const salt = await bcrypt.genSaltSync(10);
        const hashedPwd = await bcrypt.hash(newPassword, salt);
        
        // Update password
        await connection.execute(
            'UPDATE volunteers SET password = ? WHERE volunteer_id = ?', 
            [hashedPwd, volunteer_id]
        );

        console.log("✅ Password changed successfully for:", volunteer_id);
        
        return res.status(200).json({ 
            success: true,
            message: "Password changed successfully!" 
        });

    } catch (error) {
        console.log("❌ Database Error in changePassword:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error changing password",
            error: error.message
        });
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        console.log("📧 Inside Forgot Password");
        const { email } = req.body;
        
        const [volunteers] = await connection.execute(
            'SELECT * FROM volunteers WHERE email = ?', 
            [email]
        );

        if (volunteers.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "No account found with this email!" 
            });
        }
        
        const volunteer = volunteers[0];
        const resetToken = jwt.sign({ id: volunteer.id }, secretKey, { expiresIn: '1h' });
        
        // Store reset token in database
        const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await connection.execute(
            'UPDATE volunteers SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?', 
            [resetToken, expiryTime, volunteer.id]
        );

        // Send reset email (fire and forget)
        sendPasswordReset(email, resetToken, volunteer.name)
            .catch(error => console.error('Email error:', error));

        console.log("✅ Password reset link sent to:", email);
        
        return res.status(200).json({ 
            success: true,
            message: "Password reset link sent to your email!" 
        });

    } catch (error) {
        console.log("❌ Database Error in forgotPassword:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error processing reset request!",
            error: error.message
        });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        console.log("🔄 Inside Reset Password");
        const { token, newPassword } = req.body;
        
        // Verify token
        const decoded = jwt.verify(token, secretKey);
        
        // Check if token exists and not expired
        const [volunteers] = await connection.execute(
            'SELECT * FROM volunteers WHERE id = ? AND password_reset_token = ? AND password_reset_expires > NOW()', 
            [decoded.id, token]
        );

        if (volunteers.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid or expired reset token!" 
            });
        }
        
        // Hash new password
        const salt = await bcrypt.genSaltSync(10);
        const hashedPwd = await bcrypt.hash(newPassword, salt);
        
        // Update password and clear reset token
        await connection.execute(
            'UPDATE volunteers SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?', 
            [hashedPwd, decoded.id]
        );

        console.log("✅ Password reset successfully for user ID:", decoded.id);
        
        return res.status(200).json({ 
            success: true,
            message: "Password reset successfully!" 
        });

    } catch (error) {
        console.log("❌ Database Error in resetPassword:", error);
        return res.status(401).json({ 
            success: false,
            message: "Invalid or expired reset token!",
            error: error.message
        });
    }
};
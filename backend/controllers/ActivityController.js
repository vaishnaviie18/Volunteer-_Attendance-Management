var mysql = require('mysql');
require('dotenv').config();
var connection = require('../config/conn')

module.exports.createActivity = async (req, res) => {
    try {
        console.log("🎯 Inside Create Activity Controller");
        console.log("📦 Request body:", req.body);
        
        const { activity_code, name, description, activity_date, start_time, end_time, duration_hours, location, category } = req.body;
        
        // Use mock admin ID since auth is disabled for now
        const created_by = 1;

        // Validate required fields
        if (!activity_code || !name || !activity_date) {
            return res.status(400).json({ 
                success: false,
                message: "Activity code, name, and date are required." 
            });
        }

        // Check if activity code already exists
        const [existingActivities] = await connection.execute(
            'SELECT * FROM activities WHERE activity_code = ?', 
            [activity_code]
        );
        
        if (existingActivities.length > 0) {
            console.log("❌ Activity code already exists:", activity_code);
            return res.status(400).json({ 
                success: false,
                message: "Activity code already exists." 
            });
        }

        // Format the date to ensure it's in YYYY-MM-DD format
        let formattedDate = activity_date;
        try {
            // If it's an ISO string, extract just the date part
            if (activity_date.includes('T')) {
                formattedDate = activity_date.split('T')[0];
            }
            // Validate the date format (basic validation)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(formattedDate)) {
                return res.status(400).json({ 
                    success: false,
                    message: "Invalid date format. Please use YYYY-MM-DD format." 
                });
            }
        } catch (error) {
            console.log("❌ Date formatting error:", error);
            return res.status(400).json({ 
                success: false,
                message: "Invalid date format." 
            });
        }

        // Use explicit column names instead of SET ?
        const query = `INSERT INTO activities 
                      (activity_code, name, description, activity_date, start_time, end_time, duration_hours, location, category, created_by) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const [result] = await connection.execute(query, [
            activity_code, 
            name, 
            description, 
            formattedDate,
            start_time,
            end_time,
            duration_hours,
            location,
            category,
            created_by
        ]);

        console.log("✅ Activity created successfully with ID:", result.insertId);
        
        return res.status(200).json({ 
            success: true,
            message: "Activity created successfully!",
            data: {
                id: result.insertId,
                activity_code,
                name,
                description,
                activity_date: formattedDate,
                start_time,
                end_time,
                duration_hours,
                location,
                category
            }
        });

    } catch (error) {
        console.log("❌ Database Error in createActivity:", error);
        return res.status(500).json({ 
            success: false,
            message: "Activity creation failed. Please try again.",
            error: error.message 
        });
    }
};

module.exports.getActivities = async (req, res) => {
    try {
        console.log("📋 Inside Get Activities");
        console.log("📦 Request body:", req.body);
        
        const { page = 1, limit = 50 } = req.body;
        const offset = (page - 1) * limit;

        // Simplified without pagination for now
        const [activities] = await connection.execute(
            'SELECT * FROM activities ORDER BY activity_date DESC, created_at DESC'
        );

        console.log(`✅ Found ${activities.length} activities`);

        return res.status(200).json({ 
            success: true,
            data: activities,
            pagination: {
                page,
                limit,
                total: activities.length,
                pages: Math.ceil(activities.length / limit)
            }
        });

    } catch (error) {
        console.log("❌ Database Error in getActivities:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching activities",
            error: error.message
        });
    }
};

module.exports.updateActivity = async (req, res) => {
    try {
        console.log("✏️ Inside Update Activity Controller");
        console.log("📦 Request body:", req.body);
        
        const { id, activity_code, name, description, activity_date, start_time, end_time, duration_hours, location, category } = req.body;
      
        if (!id) {
            return res.status(400).json({ 
                success: false,
                message: "Activity ID is required for update." 
            });
        }

        // Format the date to ensure it's in YYYY-MM-DD format
        let formattedDate = activity_date;
        try {
            // If it's an ISO string, extract just the date part
            if (activity_date && activity_date.includes('T')) {
                formattedDate = activity_date.split('T')[0];
            }
            // Validate the date format (basic validation)
            if (formattedDate) {
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!dateRegex.test(formattedDate)) {
                    return res.status(400).json({ 
                        success: false,
                        message: "Invalid date format. Please use YYYY-MM-DD format." 
                    });
                }
            }
        } catch (error) {
            console.log("❌ Date formatting error:", error);
            return res.status(400).json({ 
                success: false,
                message: "Invalid date format." 
            });
        }

        // Use explicit UPDATE query instead of SET ?
        const query = `UPDATE activities 
                      SET activity_code = ?, name = ?, description = ?, activity_date = ?, 
                          start_time = ?, end_time = ?, duration_hours = ?, location = ?, category = ?
                      WHERE id = ?`;
        
        const [result] = await connection.execute(query, [
            activity_code, 
            name, 
            description, 
            formattedDate,
            start_time,
            end_time,
            duration_hours,
            location,
            category,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Activity not found" 
            });
        }

        console.log("✅ Activity updated successfully");
        
        return res.status(200).json({ 
            success: true,
            message: "Activity updated successfully!",
            data: {
                id,
                activity_code,
                name,
                description,
                activity_date: formattedDate,
                start_time,
                end_time,
                duration_hours,
                location,
                category
            }
        });

    } catch (error) {
        console.log("❌ Database Error in updateActivity:", error);
        return res.status(500).json({ 
            success: false,
            message: "Activity update failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.deleteActivity = async (req, res) => {
    try {
        console.log("🗑️ Inside Delete Activity Controller");
        console.log("📦 Request body:", req.body);
        
        const { id } = req.body;

        const [result] = await connection.execute(
            'DELETE FROM activities WHERE id = ?', 
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Activity not found" 
            });
        }

        console.log("✅ Activity deleted successfully");
        
        return res.status(200).json({ 
            success: true,
            message: "Activity deleted successfully!"
        });

    } catch (error) {
        console.log("❌ Database Error in deleteActivity:", error);
        return res.status(500).json({ 
            success: false,
            message: "Activity deletion failed. Please try again.",
            error: error.message
        });
    }
};

// Update the attendance functions to use promise style as well
module.exports.markAttendance = async (req, res) => {
    try {
        console.log("✅ Inside Mark Attendance Controller");
        const { activity_id, attendance } = req.body;

        const activityDate = new Date().toISOString().split('T')[0];
        let processed = 0;
        const total = attendance.length;

        for (const record of attendance) {
            const { volunteer_id, status } = record;

            // Check if already exists
            const [existing] = await connection.execute(
                'SELECT * FROM activity_attendance WHERE activity_id = ? AND volunteer_id = ? AND date = ?',
                [activity_id, volunteer_id, activityDate]
            );

            if (existing.length > 0) {
                // Update existing
                await connection.execute(
                    'UPDATE activity_attendance SET status = ? WHERE activity_id = ? AND volunteer_id = ? AND date = ?',
                    [status, activity_id, volunteer_id, activityDate]
                );
            } else {
                // Insert new
                await connection.execute(
                    'INSERT INTO activity_attendance (activity_id, volunteer_id, status, date) VALUES (?, ?, ?, ?)',
                    [activity_id, volunteer_id, status, activityDate]
                );
            }
            processed++;
        }

        return res.status(200).json({ 
            success: true,
            message: `Attendance marked successfully for ${processed} volunteers!` 
        });
    } catch (error) {
        console.log("❌ Attendance Error: ", error);
        return res.status(500).json({ 
            success: false,
            message: `Error marking attendance: ${error.message}` 
        });
    }
};

module.exports.getActivityAttendance = async (req, res) => {
    try {
        console.log("📊 Inside Get Activity Attendance Controller");
        const { activity_id } = req.body;

        const query = `
            SELECT v.volunteer_id, v.name, v.year, v.branch, aa.status, aa.date
            FROM activity_attendance aa
            JOIN volunteers v ON aa.volunteer_id = v.volunteer_id
            WHERE aa.activity_id = ?
            ORDER BY v.volunteer_id
        `;

        const [attendance] = await connection.execute(query, [activity_id]);
        
        return res.status(200).json({ 
            success: true,
            data: attendance 
        });
    } catch (error) {
        console.log("❌ Database Error in getActivityAttendance:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching attendance",
            error: error.message
        });
    }
};
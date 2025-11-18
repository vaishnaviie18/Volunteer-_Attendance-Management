var mysql = require('mysql');
require('dotenv').config();
var connection = require('../config/conn')

module.exports.addIndividualWork = async (req, res) => {
    try {
        console.log("💼 Inside Add Individual Work Controller");
        const { volunteer_id, work_type, work_date, hours_spent, description } = req.body;
        
        // Use mock admin ID since auth is disabled for now
        const assigned_by = 1;

        const query = `INSERT INTO individual_work 
                      (volunteer_id, work_type, work_date, hours_spent, description, assigned_by) 
                      VALUES (?, ?, ?, ?, ?, ?)`;
        
        const [result] = await connection.execute(query, [
            volunteer_id, work_type, work_date, hours_spent, description, assigned_by
        ]);

        console.log("✅ Individual work added successfully with ID:", result.insertId);
        
        return res.status(200).json({ 
            success: true,
            message: "Work assigned successfully!",
            data: {
                id: result.insertId,
                volunteer_id,
                work_type,
                work_date,
                hours_spent,
                description,
                assigned_by
            }
        });

    } catch (error) {
        console.log("❌ Database Error in addIndividualWork:", error);
        return res.status(500).json({ 
            success: false,
            message: "Work assignment failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.getVolunteerWork = async (req, res) => {
    try {
        console.log("📋 Inside Get Volunteer Work");
        const { volunteer_id } = req.body;

        const query = `SELECT * FROM individual_work WHERE volunteer_id = ? ORDER BY work_date DESC`;

        const [work] = await connection.execute(query, [volunteer_id]);
        
        return res.status(200).json({ 
            success: true,
            data: work 
        });

    } catch (error) {
        console.log("❌ Database Error in getVolunteerWork:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching work records",
            error: error.message
        });
    }
};

module.exports.getAllWork = async (req, res) => {
    try {
        console.log("📊 Inside Get All Work");
        const { page = 1, limit = 50 } = req.body;
        const offset = (page - 1) * limit;

        const query = `
            SELECT iw.*, v.name as volunteer_name, v.branch, v.year
            FROM individual_work iw
            JOIN volunteers v ON iw.volunteer_id = v.volunteer_id
            ORDER BY iw.work_date DESC, iw.created_at DESC
            LIMIT ? OFFSET ?
        `;

        const [work] = await connection.execute(query, [parseInt(limit), offset]);

        // Get total count
        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM individual_work');
        const total = countResult[0].total;

        console.log(`✅ Found ${work.length} individual work records`);

        return res.status(200).json({ 
            success: true,
            data: work,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.log("❌ Database Error in getAllWork:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching work records",
            error: error.message
        });
    }
};

module.exports.updateWork = async (req, res) => {
    try {
        console.log("✏️ Inside Update Work Controller");
        const { id, work_type, work_date, hours_spent, description } = req.body;

        const query = `UPDATE individual_work 
                      SET work_type = ?, work_date = ?, hours_spent = ?, description = ?
                      WHERE id = ?`;
        
        const [result] = await connection.execute(query, [
            work_type, work_date, hours_spent, description, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Work record not found" 
            });
        }

        console.log("✅ Work updated successfully");
        
        return res.status(200).json({ 
            success: true,
            message: "Work updated successfully!",
            data: {
                id,
                work_type,
                work_date,
                hours_spent,
                description
            }
        });

    } catch (error) {
        console.log("❌ Database Error in updateWork:", error);
        return res.status(500).json({ 
            success: false,
            message: "Work update failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.deleteWork = async (req, res) => {
    try {
        console.log("🗑️ Inside Delete Work Controller");
        const { id } = req.body;

        const [result] = await connection.execute(
            'DELETE FROM individual_work WHERE id = ?', 
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Work record not found" 
            });
        }

        console.log("✅ Work deleted successfully");
        
        return res.status(200).json({ 
            success: true,
            message: "Work deleted successfully!" 
        });

    } catch (error) {
        console.log("❌ Database Error in deleteWork:", error);
        return res.status(500).json({ 
            success: false,
            message: "Work deletion failed. Please try again.",
            error: error.message
        });
    }
};
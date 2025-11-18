var mysql = require('mysql');
require('dotenv').config();
var connection = require('../config/conn')

module.exports.getTopPerformers = async (req, res) => {
    console.log("Inside Get Top Performers");
    
    // Use current month and year if not provided
    const currentDate = new Date();
    const month = req.body.month || currentDate.getMonth() + 1;
    const year = req.body.year || currentDate.getFullYear();
    const limit = req.body.limit || 3;

    const query = `
        SELECT 
            v.volunteer_id,
            v.name,
            v.year,
            v.branch,
            COALESCE(SUM(a.duration_hours), 0) as activity_hours,
            COALESCE(SUM(iw.hours_spent), 0) as work_hours,
            (COALESCE(SUM(a.duration_hours), 0) + COALESCE(SUM(iw.hours_spent), 0)) as total_hours
        FROM volunteers v
        LEFT JOIN activity_attendance aa ON v.volunteer_id = aa.volunteer_id 
            AND MONTH(aa.date) = ? AND YEAR(aa.date) = ? AND aa.status = 'present'
        LEFT JOIN activities a ON aa.activity_id = a.id
        LEFT JOIN individual_work iw ON v.volunteer_id = iw.volunteer_id 
            AND MONTH(iw.work_date) = ? AND YEAR(iw.work_date) = ?
        GROUP BY v.id
        ORDER BY total_hours DESC
        LIMIT ?
    `;
    
    connection.query(query, [month, year, month, year, parseInt(limit)], (err, results) => {
        if (err) {
            console.log("Database Error: ", err);
            return res.status(500).json({ "msg": "Error fetching top performers" });
        }
        res.status(200).json({ data: results });
    });
};

module.exports.getVolunteerStatistics = async (req, res) => {
    console.log("Inside Get Volunteer Statistics");
    const { volunteer_id } = req.body;

    if (!volunteer_id) {
        return res.status(400).json({ "msg": "Volunteer ID is required" });
    }

    // Activity hours and count
    const activityQuery = `
        SELECT COALESCE(SUM(a.duration_hours), 0) as total_activity_hours,
               COUNT(aa.id) as activities_attended
        FROM activity_attendance aa
        JOIN activities a ON aa.activity_id = a.id
        WHERE aa.volunteer_id = ? AND aa.status = 'present'
    `;
    
    // Individual work hours by type
    const workQuery = `
        SELECT COALESCE(SUM(hours_spent), 0) as total_work_hours,
               work_type,
               COUNT(*) as work_count
        FROM individual_work 
        WHERE volunteer_id = ?
        GROUP BY work_type
    `;

    connection.query(activityQuery, [volunteer_id], (err, activityResult) => {
        if (err) {
            console.log("Database Error: ", err);
            return res.status(500).json({ "msg": "Error calculating statistics" });
        }
        
        connection.query(workQuery, [volunteer_id], (err, workResult) => {
            if (err) {
                console.log("Database Error: ", err);
                return res.status(500).json({ "msg": "Error calculating work statistics" });
            }
            
            const activityStats = activityResult[0] || { total_activity_hours: 0, activities_attended: 0 };
            const workStats = (workResult || []).reduce((acc, curr) => {
                acc.total_work_hours += parseFloat(curr.total_work_hours) || 0;
                acc.breakdown = acc.breakdown || {};
                acc.breakdown[curr.work_type] = {
                    hours: parseFloat(curr.total_work_hours) || 0,
                    count: curr.work_count || 0
                };
                return acc;
            }, { total_work_hours: 0, breakdown: {} });
            
            const totalHours = parseFloat(activityStats.total_activity_hours) + workStats.total_work_hours;
            
            return res.status(200).json({ 
                "data": {
                    total_hours: totalHours,
                    activity_hours: parseFloat(activityStats.total_activity_hours),
                    work_hours: workStats.total_work_hours,
                    activities_attended: activityStats.activities_attended,
                    work_breakdown: workStats.breakdown
                }
            });
        });
    });
};

module.exports.getDepartmentWiseReport = async (req, res) => {
    console.log("Inside Department Wise Report");

    let query = `
        SELECT 
            v.volunteer_id,
            v.name,
            v.year,
            v.branch,
            COALESCE(SUM(a.duration_hours), 0) as activity_hours,
            COALESCE(SUM(iw.hours_spent), 0) as work_hours,
            (COALESCE(SUM(a.duration_hours), 0) + COALESCE(SUM(iw.hours_spent), 0)) as total_hours
        FROM volunteers v
        LEFT JOIN activity_attendance aa ON v.volunteer_id = aa.volunteer_id AND aa.status = 'present'
        LEFT JOIN activities a ON aa.activity_id = a.id
        LEFT JOIN individual_work iw ON v.volunteer_id = iw.volunteer_id
        WHERE 1=1
    `;

    const queryParams = [];

    if (req.body.year) {
        query += ' AND v.year = ?';
        queryParams.push(req.body.year);
    }

    if (req.body.department) {
        query += ' AND v.branch = ?';
        queryParams.push(req.body.department);
    }

    query += ' GROUP BY v.id ORDER BY total_hours DESC';

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.log("Database Error: ", err);
            return res.status(500).json({ "msg": "Error generating report" });
        }
        res.status(200).json({ data: results });
    });
};

module.exports.getCampEligibilityList = async (req, res) => {
    console.log("Inside Camp Eligibility List");
    
    const query = `
        SELECT 
            v.volunteer_id,
            v.name,
            v.year,
            v.branch,
            COALESCE(SUM(a.duration_hours), 0) as activity_hours,
            COALESCE(SUM(iw.hours_spent), 0) as work_hours,
            (COALESCE(SUM(a.duration_hours), 0) + COALESCE(SUM(iw.hours_spent), 0)) as total_hours
        FROM volunteers v
        LEFT JOIN activity_attendance aa ON v.volunteer_id = aa.volunteer_id AND aa.status = 'present'
        LEFT JOIN activities a ON aa.activity_id = a.id
        LEFT JOIN individual_work iw ON v.volunteer_id = iw.volunteer_id
        GROUP BY v.id
        ORDER BY total_hours DESC
        LIMIT 50
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.log("Database Error: ", err);
            return res.status(500).json({ "msg": "Error generating eligibility list" });
        }
        res.status(200).json({ data: results });
    });
};
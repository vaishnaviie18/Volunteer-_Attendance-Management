var mysql = require('mysql');
require('dotenv').config();
var connection = require('../config/conn')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

module.exports.registerAdmin = async (req, res) => {
    try {
        console.log("👨‍💼 Inside Admin Registration Controller");
        const { name, email, contact, branch, password } = req.body;
        
        const [existingAdmins] = await connection.execute(
            'SELECT * FROM admins WHERE email = ?', 
            [email]
        );

        if (existingAdmins.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: "Admin is already registered." 
            });
        }

        const salt = await bcrypt.genSaltSync(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        
        const query = `INSERT INTO admins 
                      (name, email, contact, branch, password, role) 
                      VALUES (?, ?, ?, ?, ?, ?)`;
        
        const [result] = await connection.execute(query, [
            name, email, contact, branch, hashedPwd, 'admin'
        ]);

        console.log("✅ Admin registered successfully with ID:", result.insertId);
        
        const adminData = { name, email, contact, branch, role: 'admin' };
        const token = jwt.sign(adminData, secretKey);
        
        return res.status(200).json({ 
            success: true,
            message: "Admin Registered Successfully!",
            data: {
                token: token,
                admin: adminData
            }
        });

    } catch (error) {
        console.log("❌ Database Error in registerAdmin:", error);
        return res.status(500).json({ 
            success: false,
            message: "Registration failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.loginAdmin = async (req, res) => {
    try {
        console.log("🔐 Inside Admin Login Controller");
        const { email, password } = req.body;
        
        const [admins] = await connection.execute(
            'SELECT * FROM admins WHERE email = ?', 
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: "Admin not registered!" 
            });
        }

        const admin = admins[0];
        const pwdCheck = await bcrypt.compare(password, admin.password);
        
        if (!pwdCheck) {
            return res.status(401).json({ 
                success: false,
                message: "Invalid Credentials" 
            });
        }

        const { password: _, ...adminData } = admin;
        const token = jwt.sign(adminData, secretKey);
        
        console.log("✅ Admin logged in successfully:", email);
        
        return res.status(200).json({ 
            success: true,
            message: "Logged in successfully!", 
            data: {
                token: token,
                admin: adminData
            }
        });

    } catch (error) {
        console.log("❌ Database Error in loginAdmin:", error);
        return res.status(500).json({ 
            success: false,
            message: "Login failed. Please try again.",
            error: error.message
        });
    }
};

module.exports.getAdmins = async (req, res) => {
    try {
        console.log("📋 Inside Get Admins");
        
        const [admins] = await connection.execute(
            'SELECT id, name, email, contact, branch, role, created_at FROM admins'
        );

        return res.status(200).json({ 
            success: true,
            data: admins 
        });

    } catch (error) {
        console.log("❌ Database Error in getAdmins:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error fetching admins",
            error: error.message
        });
    }
};

module.exports.updateAdminRole = async (req, res) => {
    try {
        console.log("⚙️ Inside Update Admin Role");
        const { adminId, role } = req.body;
        
        // Check if the requester is a super_admin
        const requesterAdminId = req.admin.id; // Assuming we have admin data in req from middleware
        const [requester] = await connection.execute(
            'SELECT role FROM admins WHERE id = ?', 
            [requesterAdminId]
        );

        if (requester.length === 0 || requester[0].role !== 'super_admin') {
            return res.status(403).json({ 
                success: false,
                message: "Only super admins can update roles" 
            });
        }
        
        await connection.execute(
            'UPDATE admins SET role = ? WHERE id = ?', 
            [role, adminId]
        );

        console.log("✅ Admin role updated successfully");
        
        return res.status(200).json({ 
            success: true,
            message: "Role updated successfully!" 
        });

    } catch (error) {
        console.log("❌ Database Error in updateAdminRole:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error updating role",
            error: error.message
        });
    }
};

module.exports.deleteAdmin = async (req, res) => {
    try {
        console.log("🗑️ Inside Delete Admin");
        const { adminId } = req.body;
        
        // Check if the requester is a super_admin
        const requesterAdminId = req.admin.id;
        const [requester] = await connection.execute(
            'SELECT role FROM admins WHERE id = ?', 
            [requesterAdminId]
        );

        if (requester.length === 0 || requester[0].role !== 'super_admin') {
            return res.status(403).json({ 
                success: false,
                message: "Only super admins can delete admins" 
            });
        }
        
        // Prevent self-deletion
        if (requesterAdminId == adminId) {
            return res.status(400).json({ 
                success: false,
                message: "You cannot delete your own account" 
            });
        }
        
        await connection.execute(
            'DELETE FROM admins WHERE id = ?', 
            [adminId]
        );

        console.log("✅ Admin deleted successfully");
        
        return res.status(200).json({ 
            success: true,
            message: "Admin deleted successfully!" 
        });

    } catch (error) {
        console.log("❌ Database Error in deleteAdmin:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error deleting admin",
            error: error.message
        });
    }
};
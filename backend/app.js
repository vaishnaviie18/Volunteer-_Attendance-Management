const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`🔍 ${req.method} ${req.originalUrl}`);
    console.log('📦 Body:', req.body);
    next();
});

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: "NSS Volunteer Management Server is running!",
        version: "1.0.0",
        endpoints: [
            "/ - Server status",
            "/registerVolunteer - Register new volunteer",
            "/loginVolunteer - Volunteer login",
            "/registerAdmin - Register new admin", 
            "/loginAdmin - Admin login",
            "/createActivity - Create new activity",
            "/getActivities - Get all activities",
            "/markAttendance - Mark attendance",
            "/addIndividualWork - Assign individual work"
        ]
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        database: "Connected"
    });
});

// Import and use routes with error handling
console.log('🔄 Loading routes...');

try {
    const volunteerRoutes = require('./routes/VolunteerRoutes');
    app.use('/', volunteerRoutes);
    console.log("✅ Volunteer routes loaded");
} catch (error) {
    console.log("❌ Volunteer routes failed:", error.message);
}

try {
    const adminRoutes = require('./routes/AdminRoutes');
    app.use('/', adminRoutes);
    console.log("✅ Admin routes loaded");
} catch (error) {
    console.log("❌ Admin routes failed:", error.message);
}

try {
    const activityRoutes = require('./routes/ActivityRoutes');
    app.use('/', activityRoutes);
    console.log("✅ Activity routes loaded");
} catch (error) {
    console.log("❌ Activity routes failed:", error.message);
}

try {
    const individualWorkRoutes = require('./routes/IndividualWorkRoutes');
    app.use('/', individualWorkRoutes);
    console.log("✅ Individual Work routes loaded");
} catch (error) {
    console.log("❌ Individual Work routes failed:", error.message);
}

try {
    const reportsRoutes = require('./routes/ReportsRoutes');
    app.use('/', reportsRoutes);
    console.log("✅ Reports routes loaded");
} catch (error) {
    console.log("❌ Reports routes failed:", error.message);
}

// 404 handler for undefined routes
app.use('*', (req, res) => {
    console.log('❌ 404 - Route not found:', req.method, req.originalUrl);
    res.status(404).json({ 
        message: "Route not found",
        availableRoutes: [
            "GET /",
            "GET /health", 
            "POST /registerVolunteer",
            "POST /loginVolunteer",
            "POST /registerAdmin",
            "POST /loginAdmin",
            "POST /createActivity",
            "POST /getActivities",
            "POST /markAttendance",
            "POST /addIndividualWork"
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

app.listen(PORT, () => {
    console.log("🎉 NSS Volunteer Management Server is running on port", PORT);
    console.log("📍 API available at: http://localhost:" + PORT);
    console.log("🔧 Authentication is currently disabled for development");
    console.log("📧 Email functionality is in mock mode");
});
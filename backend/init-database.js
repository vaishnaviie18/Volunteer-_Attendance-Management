const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

const initSQL = `
CREATE DATABASE IF NOT EXISTS attendance_management;
USE attendance_management;

-- Volunteers Table (formerly students)
CREATE TABLE IF NOT EXISTS volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id VARCHAR(20) UNIQUE NOT NULL,
    roll VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    course VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    branch VARCHAR(10) NOT NULL,
    semester INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_reset_token VARCHAR(100),
    password_reset_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins Table (formerly teachers)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contact VARCHAR(15),
    branch VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin') DEFAULT 'admin',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities Table (formerly subjects)
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    activity_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_hours DECIMAL(4,2) NOT NULL,
    location VARCHAR(100),
    category VARCHAR(50),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Attendance Table
CREATE TABLE IF NOT EXISTS activity_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id VARCHAR(20) NOT NULL,
    activity_id INT NOT NULL,
    status ENUM('present', 'absent') NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- Individual Work Table
CREATE TABLE IF NOT EXISTS individual_work (
    id INT AUTO_INCREMENT PRIMARY KEY,
    volunteer_id VARCHAR(20) NOT NULL,
    work_type ENUM('design', 'content', 'video', 'coordination', 'documentation', 'other') NOT NULL,
    work_date DATE NOT NULL,
    hours_spent DECIMAL(4,2) NOT NULL,
    description TEXT,
    assigned_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (volunteer_id) REFERENCES volunteers(volunteer_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES admins(id) ON DELETE CASCADE
);
`;

const postTablesSQL = `
USE attendance_management;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_volunteers_course_branch ON volunteers(course, branch, year);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_activity_attendance_volunteer ON activity_attendance(volunteer_id, activity_id);
CREATE INDEX IF NOT EXISTS idx_individual_work_volunteer ON individual_work(volunteer_id, work_date);
`;

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  
  console.log('Connected to MySQL server');
  
  // Create database and tables
  connection.query(initSQL, (err, results) => {
    if (err) {
      console.error('Error creating tables:', err);
      connection.end();
      return;
    }
    
    console.log('Database and tables created successfully!');
    
    // Add indexes
    connection.query(postTablesSQL, (err, results) => {
      if (err) {
        console.error('Error adding indexes:', err);
      } else {
        console.log('Indexes added successfully!');
      }
      
      console.log('\n🎉 NSS Database setup completed!');
      console.log('Tables created:');
      console.log('✅ volunteers');
      console.log('✅ admins'); 
      console.log('✅ activities');
      console.log('✅ activity_attendance');
      console.log('✅ individual_work');
      
      connection.end();
    });
  });
});
import React, { useState, useEffect } from 'react'
import Header from '../header/Header'
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import { path } from '../../path'

const axios = require('axios')

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// Helper function to format date for input field (yyyy-MM-dd)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Convert to local date in yyyy-MM-dd format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

// Helper function to format date for backend (yyyy-MM-dd)
const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        
        // Ensure we're sending date in yyyy-MM-dd format
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('Error formatting date for backend:', error);
        return dateString; // Return original if parsing fails
    }
};

const ActivityManagement = () => {
    const [open, setOpen] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [activities, setActivities] = useState([]);
    const [currentActivity, setCurrentActivity] = useState(null);
    
    // Form states
    const [activityCode, setActivityCode] = useState("");
    const [activityName, setActivityName] = useState("");
    const [description, setDescription] = useState("");
    const [activityDate, setActivityDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [duration, setDuration] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");

    const categories = [
        'Social Service',
        'Awareness Campaign',
        'Cleanliness Drive',
        'Tree Plantation',
        'Blood Donation',
        'Other'
    ];

    const getAllActivities = async () => {
        try {
            const response = await axios.post(`${path}/getActivities`, {
                page: 1,
                limit: 50
            });
            if (response.status === 200) {
                setActivities(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            toast.error('Failed to load activities');
        }
    };

    const handleCreateActivity = async () => {
        if (!activityCode || !activityName || !activityDate || !duration) {
            toast.warn('Please fill all required fields');
            return;
        }

        try {
            await axios.post(`${path}/createActivity`, {
                activity_code: activityCode,
                name: activityName,
                description: description,
                activity_date: formatDateForBackend(activityDate),
                start_time: startTime,
                end_time: endTime,
                duration_hours: parseFloat(duration),
                location: location,
                category: category
            });
            toast.success('Activity created successfully!');
            handleClose();
            getAllActivities();
        } catch (error) {
            console.error('Error creating activity:', error);
            toast.error('Failed to create activity');
        }
    };

    const handleUpdateActivity = async () => {
        if (!currentActivity) return;

        try {
            await axios.post(`${path}/updateActivity`, {
                id: currentActivity.id,
                activity_code: activityCode,
                name: activityName,
                description: description,
                activity_date: formatDateForBackend(activityDate),
                start_time: startTime,
                end_time: endTime,
                duration_hours: parseFloat(duration),
                location: location,
                category: category
            });
            toast.success('Activity updated successfully!');
            handleClose();
            getAllActivities();
        } catch (error) {
            console.error('Error updating activity:', error);
            toast.error('Failed to update activity');
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) return;

        try {
            await axios.post(`${path}/deleteActivity`, { id: activityId });
            toast.success('Activity deleted successfully!');
            getAllActivities();
        } catch (error) {
            console.error('Error deleting activity:', error);
            toast.error('Failed to delete activity');
        }
    };

    const handleEditClick = (activity) => {
        setCurrentActivity(activity);
        setActivityCode(activity.activity_code);
        setActivityName(activity.name);
        setDescription(activity.description || '');
        // Format the date for the input field
        setActivityDate(formatDateForInput(activity.activity_date));
        setStartTime(activity.start_time || '');
        setEndTime(activity.end_time || '');
        setDuration(activity.duration_hours);
        setLocation(activity.location || '');
        setCategory(activity.category || '');
        setOpenUpdateDialog(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenUpdateDialog(false);
        setCurrentActivity(null);
        // Reset form
        setActivityCode("");
        setActivityName("");
        setDescription("");
        setActivityDate("");
        setStartTime("");
        setEndTime("");
        setDuration("");
        setLocation("");
        setCategory("");
    };

    const calculateDuration = () => {
        if (startTime && endTime) {
            const start = new Date(`2000-01-01T${startTime}`);
            const end = new Date(`2000-01-01T${endTime}`);
            const diff = (end - start) / (1000 * 60 * 60); // Convert to hours
            setDuration(diff.toFixed(2));
        }
    };

    useEffect(() => {
        getAllActivities();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">Activity Management</h1>
                    <p className="text-blue-100">Create and manage NSS activities and events</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">All Activities</h2>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                + Create New Activity
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {activities.length > 0 ? (
                            <TableContainer component={Paper} className="shadow-sm">
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Activity Code</StyledTableCell>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell align="center">Date</StyledTableCell>
                                            <StyledTableCell align="center">Duration</StyledTableCell>
                                            <StyledTableCell align="center">Category</StyledTableCell>
                                            <StyledTableCell align="center">Location</StyledTableCell>
                                            <StyledTableCell align="center">Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {activities.map((activity) => (
                                            <StyledTableRow key={activity.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                                        {activity.activity_code}
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <div>
                                                        <div className="font-semibold">{activity.name}</div>
                                                        {activity.description && (
                                                            <div className="text-sm text-gray-600 truncate max-w-xs">
                                                                {activity.description}
                                                            </div>
                                                        )}
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {new Date(activity.activity_date).toLocaleDateString()}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {activity.duration_hours} hrs
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                                                        {activity.category}
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {activity.location}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button 
                                                            onClick={() => handleEditClick(activity)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteActivity(activity.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">📅</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Activities Found</h3>
                                <p className="text-gray-500">Create your first activity to get started</p>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setOpen(true)}
                                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    Create First Activity
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Activity Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Create New Activity
                </DialogTitle>
                <DialogContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Activity Code"
                            value={activityCode}
                            onChange={(e) => setActivityCode(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Activity Name"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            margin="dense"
                        />
                        <TextField
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            select
                            fullWidth
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value=""></option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Activity Date"
                            type="date"
                            value={activityDate}
                            onChange={(e) => setActivityDate(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            onBlur={calculateDuration}
                            fullWidth
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            onBlur={calculateDuration}
                            fullWidth
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Duration (hours)"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            inputProps={{ step: "0.5", min: "0.5" }}
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleCreateActivity}
                        variant="contained"
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        Create Activity
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Activity Dialog */}
            <Dialog open={openUpdateDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    Update Activity
                </DialogTitle>
                <DialogContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Activity Code"
                            value={activityCode}
                            onChange={(e) => setActivityCode(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Activity Name"
                            value={activityName}
                            onChange={(e) => setActivityName(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            margin="dense"
                        />
                        <TextField
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            select
                            fullWidth
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value=""></option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Activity Date"
                            type="date"
                            value={activityDate}
                            onChange={(e) => setActivityDate(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            onBlur={calculateDuration}
                            fullWidth
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            onBlur={calculateDuration}
                            fullWidth
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Duration (hours)"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            inputProps={{ step: "0.5", min: "0.5" }}
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleUpdateActivity}
                        variant="contained"
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                    >
                        Update Activity
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ActivityManagement
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

const IndividualWork = () => {
    const [open, setOpen] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [workRecords, setWorkRecords] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [currentWork, setCurrentWork] = useState(null);
    
    // Form states
    const [selectedVolunteer, setSelectedVolunteer] = useState("");
    const [workType, setWorkType] = useState("");
    const [workDate, setWorkDate] = useState("");
    const [hoursSpent, setHoursSpent] = useState("");
    const [description, setDescription] = useState("");

    const workTypes = [
        'design',
        'content',
        'video',
        'coordination',
        'documentation',
        'other'
    ];

    const getAllWork = async () => {
        try {
            const response = await axios.post(`${path}/getAllWork`, {
                page: 1,
                limit: 50
            });
            if (response.status === 200) {
                setWorkRecords(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching work records:', error);
            toast.error('Failed to load work records');
        }
    };

    const getVolunteers = async () => {
        try {
            // Get volunteers from department report
            const response = await axios.post(`${path}/getDepartmentWiseReport`, {});
            if (response.status === 200) {
                setVolunteers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const handleAddWork = async () => {
        if (!selectedVolunteer || !workType || !workDate || !hoursSpent) {
            toast.warn('Please fill all required fields');
            return;
        }

        try {
            await axios.post(`${path}/addIndividualWork`, {
                volunteer_id: selectedVolunteer,
                work_type: workType,
                work_date: workDate,
                hours_spent: parseFloat(hoursSpent),
                description: description
            });
            toast.success('Work assigned successfully!');
            handleClose();
            getAllWork();
        } catch (error) {
            console.error('Error assigning work:', error);
            toast.error('Failed to assign work');
        }
    };

    const handleUpdateWork = async () => {
        if (!currentWork) return;

        try {
            await axios.post(`${path}/updateWork`, {
                id: currentWork.id,
                work_type: workType,
                work_date: workDate,
                hours_spent: parseFloat(hoursSpent),
                description: description
            });
            toast.success('Work updated successfully!');
            handleClose();
            getAllWork();
        } catch (error) {
            console.error('Error updating work:', error);
            toast.error('Failed to update work');
        }
    };

    const handleDeleteWork = async (workId) => {
        if (!window.confirm('Are you sure you want to delete this work record?')) return;

        try {
            await axios.post(`${path}/deleteWork`, { id: workId });
            toast.success('Work record deleted successfully!');
            getAllWork();
        } catch (error) {
            console.error('Error deleting work:', error);
            toast.error('Failed to delete work record');
        }
    };

    const handleEditClick = (work) => {
        setCurrentWork(work);
        setSelectedVolunteer(work.volunteer_id);
        setWorkType(work.work_type);
        setWorkDate(work.work_date);
        setHoursSpent(work.hours_spent);
        setDescription(work.description || '');
        setOpenUpdateDialog(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenUpdateDialog(false);
        setCurrentWork(null);
        // Reset form
        setSelectedVolunteer("");
        setWorkType("");
        setWorkDate("");
        setHoursSpent("");
        setDescription("");
    };

    const getWorkTypeColor = (type) => {
        const colors = {
            design: 'bg-purple-100 text-purple-800',
            content: 'bg-blue-100 text-blue-800',
            video: 'bg-red-100 text-red-800',
            coordination: 'bg-green-100 text-green-800',
            documentation: 'bg-yellow-100 text-yellow-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[type] || colors.other;
    };

    useEffect(() => {
        getAllWork();
        getVolunteers();
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
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">Individual Work Assignment</h1>
                    <p className="text-purple-100">Assign and track individual tasks for NSS volunteers</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Work Assignments</h2>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpen(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                + Assign New Work
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {workRecords.length > 0 ? (
                            <TableContainer component={Paper} className="shadow-sm">
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Volunteer</StyledTableCell>
                                            <StyledTableCell align="center">Work Type</StyledTableCell>
                                            <StyledTableCell align="center">Date</StyledTableCell>
                                            <StyledTableCell align="center">Hours</StyledTableCell>
                                            <StyledTableCell align="center">Description</StyledTableCell>
                                            <StyledTableCell align="center">Assigned By</StyledTableCell>
                                            <StyledTableCell align="center">Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workRecords.map((work) => (
                                            <StyledTableRow key={work.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    <div>
                                                        <div className="font-semibold">{work.volunteer_name}</div>
                                                        <div className="text-sm text-gray-600">{work.volunteer_id}</div>
                                                        <div className="text-sm text-gray-500">{work.branch} • Year {work.year}</div>
                                                    </div>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkTypeColor(work.work_type)}`}>
                                                        {work.work_type.charAt(0).toUpperCase() + work.work_type.slice(1)}
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {new Date(work.work_date).toLocaleDateString()}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                                                        {work.hours_spent} hrs
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {work.description || '-'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {work.assigned_by_name}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button 
                                                            onClick={() => handleEditClick(work)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteWork(work.id)}
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
                                <div className="text-gray-400 text-6xl mb-4">💼</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Work Assignments</h3>
                                <p className="text-gray-500">Start assigning individual work to volunteers</p>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setOpen(true)}
                                    className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                >
                                    Assign First Work
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Work Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Assign Individual Work
                </DialogTitle>
                <DialogContent className="pt-6">
                    <div className="space-y-4">
                        <TextField
                            label="Select Volunteer"
                            value={selectedVolunteer}
                            onChange={(e) => setSelectedVolunteer(e.target.value)}
                            select
                            fullWidth
                            required
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value=""></option>
                            {volunteers.map((volunteer) => (
                                <option key={volunteer.volunteer_id} value={volunteer.volunteer_id}>
                                    {volunteer.name} ({volunteer.volunteer_id}) - {volunteer.branch} Year {volunteer.year}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            label="Work Type"
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                            select
                            fullWidth
                            required
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value=""></option>
                            {workTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            label="Work Date"
                            type="date"
                            value={workDate}
                            onChange={(e) => setWorkDate(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="Hours Spent"
                            type="number"
                            value={hoursSpent}
                            onChange={(e) => setHoursSpent(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            inputProps={{ step: "0.5", min: "0.5" }}
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            margin="dense"
                            placeholder="Describe the work assigned..."
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleAddWork}
                        variant="contained"
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                        Assign Work
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Update Work Dialog */}
            <Dialog open={openUpdateDialog} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    Update Work Assignment
                </DialogTitle>
                <DialogContent className="pt-6">
                    <div className="space-y-4">
                        <TextField
                            label="Volunteer"
                            value={selectedVolunteer}
                            fullWidth
                            margin="dense"
                            disabled
                            helperText="Volunteer cannot be changed"
                        />

                        <TextField
                            label="Work Type"
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                            select
                            fullWidth
                            required
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value=""></option>
                            {workTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </TextField>

                        <TextField
                            label="Work Date"
                            type="date"
                            value={workDate}
                            onChange={(e) => setWorkDate(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <TextField
                            label="Hours Spent"
                            type="number"
                            value={hoursSpent}
                            onChange={(e) => setHoursSpent(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                            inputProps={{ step: "0.5", min: "0.5" }}
                        />

                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            margin="dense"
                            placeholder="Describe the work assigned..."
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button 
                        onClick={handleUpdateWork}
                        variant="contained"
                        className="bg-gradient-to-r from-green-600 to-blue-600"
                    >
                        Update Work
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default IndividualWork
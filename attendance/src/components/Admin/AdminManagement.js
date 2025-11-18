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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
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

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    
    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [branch, setBranch] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const branches = [
        ['CSE', 'Computer Science & Engineering'],
        ['ECE', 'Electronics & Communication Engineering'],
        ['EEE', 'Electrical & Electronics Engineering'],
        ['ME', 'Mechanical Engineering'],
        ['CE', 'Civil Engineering']
    ];

    const getAllAdmins = async () => {
        try {
            const response = await axios.post(`${path}/getAdmins`);
            if (response.status === 200) {
                setAdmins(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
            toast.error('Failed to load admins');
        }
    };

    const handleCreateAdmin = async () => {
        if (!name || !email || !branch || !password) {
            toast.warn('Please fill all required fields');
            return;
        }

        if (password !== confirmPassword) {
            toast.warn('Passwords do not match');
            return;
        }

        try {
            await axios.post(`${path}/registerAdmin`, {
                name: name,
                email: email,
                contact: contact,
                branch: branch,
                password: password
            });
            toast.success('Admin created successfully!');
            handleCloseDialogs();
            getAllAdmins();
        } catch (error) {
            console.error('Error creating admin:', error);
            toast.error('Failed to create admin');
        }
    };

    const handleUpdateRole = async (adminId, newRole) => {
        try {
            await axios.post(`${path}/updateAdminRole`, {
                adminId: adminId,
                role: newRole
            });
            toast.success('Admin role updated successfully!');
            setOpenRoleDialog(false);
            getAllAdmins();
        } catch (error) {
            console.error('Error updating admin role:', error);
            toast.error('Failed to update admin role');
        }
    };

    const handleDeleteAdmin = async (adminId) => {
        if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;

        try {
            await axios.post(`${path}/deleteAdmin`, { adminId: adminId });
            toast.success('Admin deleted successfully!');
            getAllAdmins();
        } catch (error) {
            console.error('Error deleting admin:', error);
            toast.error('Failed to delete admin');
        }
    };

    const handleCloseDialogs = () => {
        setOpenCreateDialog(false);
        setOpenRoleDialog(false);
        setSelectedAdmin(null);
        // Reset form
        setName("");
        setEmail("");
        setContact("");
        setBranch("");
        setPassword("");
        setConfirmPassword("");
    };

    const openRoleChangeDialog = (admin) => {
        setSelectedAdmin(admin);
        setOpenRoleDialog(true);
    };

    // Check if current user is super admin
    const isSuperAdmin = localStorage.getItem('type') === 'super_admin';

    useEffect(() => {
        if (!isSuperAdmin) {
            toast.error('Access denied. Only super admins can manage admins.');
            // You might want to redirect them
            return;
        }
        getAllAdmins();
    }, [isSuperAdmin]);

    if (!isSuperAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                        <div className="text-red-500 text-6xl mb-4">🚫</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-6">You need super admin privileges to access this page.</p>
                        <a href="/admin" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            Return to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        );
    }

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
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-center text-white mb-8 shadow-xl">
                    <h1 className="text-3xl font-bold mb-2">Admin Management</h1>
                    <p className="text-yellow-100">Manage admin accounts and permissions for PICT NSS</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">System Administrators</h2>
                                <p className="text-gray-600">Manage who can access and manage the NSS system</p>
                            </div>
                            <Button 
                                variant="contained" 
                                onClick={() => setOpenCreateDialog(true)}
                                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 mt-4 md:mt-0"
                            >
                                + Add New Admin
                            </Button>
                        </div>
                    </div>

                    <div className="p-6">
                        {admins.length > 0 ? (
                            <TableContainer component={Paper} className="shadow-sm">
                                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Name</StyledTableCell>
                                            <StyledTableCell align="center">Email</StyledTableCell>
                                            <StyledTableCell align="center">Contact</StyledTableCell>
                                            <StyledTableCell align="center">Department</StyledTableCell>
                                            <StyledTableCell align="center">Role</StyledTableCell>
                                            <StyledTableCell align="center">Created</StyledTableCell>
                                            <StyledTableCell align="center">Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {admins.map((admin) => (
                                            <StyledTableRow key={admin.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    <div className="font-semibold">{admin.name}</div>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className="text-blue-600">{admin.email}</span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {admin.contact || 'N/A'}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                                        {admin.branch}
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                        admin.role === 'super_admin' 
                                                            ? 'bg-purple-100 text-purple-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                                    </span>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    {new Date(admin.created_at).toLocaleDateString()}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <div className="flex justify-center space-x-2">
                                                        <button 
                                                            onClick={() => openRoleChangeDialog(admin)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                                        >
                                                            Change Role
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteAdmin(admin.id)}
                                                            disabled={admin.role === 'super_admin'} // Prevent deleting super admins
                                                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                                                admin.role === 'super_admin'
                                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-red-500 hover:bg-red-600 text-white'
                                                            }`}
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
                                <div className="text-gray-400 text-6xl mb-4">👥</div>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Admins Found</h3>
                                <p className="text-gray-500">Create the first admin account to get started</p>
                                <Button 
                                    variant="contained" 
                                    onClick={() => setOpenCreateDialog(true)}
                                    className="mt-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                                >
                                    Create First Admin
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-start">
                        <div className="text-blue-500 text-2xl mr-4">💡</div>
                        <div>
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Admin Management Guidelines</h3>
                            <ul className="text-blue-700 space-y-1 text-sm">
                                <li>• Super Admins have full system access including admin management</li>
                                <li>• Regular Admins can manage activities, attendance, and reports</li>
                                <li>• You cannot delete Super Admin accounts for security reasons</li>
                                <li>• Ensure each admin has a valid institutional email address</li>
                                <li>• Regularly review and update admin permissions as needed</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Admin Dialog */}
            <Dialog open={openCreateDialog} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                    Create New Admin
                </DialogTitle>
                <DialogContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Contact Number"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Department"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            select
                            fullWidth
                            required
                            margin="dense"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value=""></option>
                            {branches.map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </TextField>
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            fullWidth
                            required
                            margin="dense"
                        />
                    </div>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleCloseDialogs}>Cancel</Button>
                    <Button 
                        onClick={handleCreateAdmin}
                        variant="contained"
                        className="bg-gradient-to-r from-yellow-600 to-orange-600"
                    >
                        Create Admin
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Change Role Dialog */}
            <Dialog open={openRoleDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
                <DialogTitle className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Change Admin Role
                </DialogTitle>
                <DialogContent className="pt-6">
                    {selectedAdmin && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold">{selectedAdmin.name}</p>
                                <p className="text-gray-600 text-sm">{selectedAdmin.email}</p>
                                <p className="text-gray-600 text-sm">Current Role: 
                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                        selectedAdmin.role === 'super_admin' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {selectedAdmin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Select New Role</label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="admin" 
                                            checked={selectedAdmin.role !== 'super_admin'}
                                            onChange={() => setSelectedAdmin({...selectedAdmin, role: 'admin'})}
                                            className="text-blue-600"
                                        />
                                        <div>
                                            <span className="font-medium">Admin</span>
                                            <p className="text-sm text-gray-500">Can manage activities, attendance, and reports</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="role" 
                                            value="super_admin" 
                                            checked={selectedAdmin.role === 'super_admin'}
                                            onChange={() => setSelectedAdmin({...selectedAdmin, role: 'super_admin'})}
                                            className="text-purple-600"
                                        />
                                        <div>
                                            <span className="font-medium">Super Admin</span>
                                            <p className="text-sm text-gray-500">Full system access including admin management</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={handleCloseDialogs}>Cancel</Button>
                    <Button 
                        onClick={() => handleUpdateRole(selectedAdmin?.id, selectedAdmin?.role)}
                        variant="contained"
                        className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                        Update Role
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default AdminManagement
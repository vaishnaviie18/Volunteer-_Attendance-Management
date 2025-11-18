import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requiredUserType }) => {
    const token = localStorage.getItem('token')
    const userType = localStorage.getItem('userType')

    if (!token) {
        return <Navigate to="/" replace />
    }

    if (requiredUserType && userType !== requiredUserType) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
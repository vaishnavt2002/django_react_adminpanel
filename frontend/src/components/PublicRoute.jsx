import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({children}) => {
    const {user, token}  = useSelector((state)=> state.auth)
    if (token) {
        if (user?.is_superuser) {
          return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/profile" replace />;
      }
  return children
}

export default PublicRoute

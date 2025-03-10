import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children,adminOnly = false}) => {
    const {token,user} = useSelector((state)=>state.auth)
    if (!token){
        return <Navigate to='/'/>
    }
    if(adminOnly&&!user?.is_superuser){
        return <Navigate to='/profile'/>
    }
  return children;
}

export default ProtectedRoute

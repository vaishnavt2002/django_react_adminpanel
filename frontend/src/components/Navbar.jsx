import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const { token,user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div>
        {!token?
        <>
        <Link to="/" className="text-blue-600 hover:underline mx-4">
          Login
        </Link>
        <Link to="/register" className="text-blue-600 hover:underline mx-4">
          Register
        </Link>
        </>
        :
          <>
          {user?.is_superuser? "Welcome Admin": `Welcome, ${user?.username}`}
          </>
}
      </div>
      {token && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
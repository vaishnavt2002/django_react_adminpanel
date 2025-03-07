import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { createUser, deleteUser, getAllUser, updateUser } from '../API/Api';

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ email: '', phone: '', address: '' });
  const [editValidationErrors, setEditValidationErrors] = useState({});
  const [editBackendErrors, setEditBackendErrors] = useState({}); // Added for edit backend errors
  const [newUser, setNewUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({ username: '', email: '', phone: '', address: '', password: '', user_profile: null });
  const [newUserValidationErrors, setNewUserValidationErrors] = useState({});
  const [newUserBackendErrors, setNewUserBackendErrors] = useState({}); // Added for new user backend errors

  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const response = await getAllUser();
          setUsers(response);
        } catch (error) {
          console.log("Failed", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [token]);

  const editingClickHandler = (user) => {
    setEditingUser(user.id);
    setEditForm({ email: user.email, phone: user.phone, address: user.address });
    setEditValidationErrors({});
    setEditBackendErrors({}); // Clear backend errors when starting edit
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const validateEditForm = () => {
    const errors = {};
    const phoneRegex = /^[4-9][0-9]{9}$/;
    if (!editForm.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(editForm.phone)) {
      errors.phone = "Invalid Phone number";
    }

    if (!editForm.address) {
      errors.address = "Address is required";
    } else if (editForm.address.length < 5) {
      errors.address = "Address must be 5 or more characters";
    }

    setEditValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const editHandleSubmit = async (userId) => {
    if (!validateEditForm()) {
      return;
    }
    try {
      const updatedUser = await updateUser(userId, editForm);
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)));
      setEditingUser(null);
      setEditValidationErrors({});
      setEditBackendErrors({});
    } catch (error) {
      // Assuming error.response.data contains the backend error details
      const backendErrors = error.response?.data || { error: "An unexpected error occurred" };
      setEditBackendErrors(backendErrors);
      console.log("Edit failed:", error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Do you want to delete this user?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNewUserChange = (e) => {
    if (e.target.name === 'user_profile') {
      setNewUserForm({ ...newUserForm, user_profile: e.target.files[0] });
    } else {
      setNewUserForm({ ...newUserForm, [e.target.name]: e.target.value });
    }
  };

  const validateNewUserForm = () => {
    const errors = {};
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!newUserForm.username.trim()) {
      errors.username = "Username is required";
    } else if (newUserForm.username.length <= 4) {
      errors.username = "Username must be more than 4 characters";
    } else if (!usernameRegex.test(newUserForm.username)) {
      errors.username = "Username can only contain letters and numbers";
    }

    const phoneRegex = /^[4-9][0-9]{9}$/;
    if (!newUserForm.phone) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(newUserForm.phone)) {
      errors.phone = "Invalid Phone number";
    }

    if (!newUserForm.address) {
      errors.address = "Address is required";
    } else if (newUserForm.address.length < 5) {
      errors.address = "Address must be 5 or more characters";
    }

    if (!newUserForm.password) {
      errors.password = "Password is required";
    } else if (newUserForm.password.length <= 6) {
      errors.password = "Password must be more than 6 characters";
    } else if (/\s/.test(newUserForm.password)) {
      errors.password = "Password cannot contain spaces";
    }

    setNewUserValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    if (!validateNewUserForm()) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('username', newUserForm.username);
      formData.append('email', newUserForm.email);
      formData.append('phone', newUserForm.phone);
      formData.append('address', newUserForm.address);
      formData.append('password', newUserForm.password);
      if (newUserForm.user_profile) {
        formData.append('user_profile', newUserForm.user_profile);
      }
      const newUserData = await createUser(formData);
      const response = await getAllUser();
      setUsers(response);
      setNewUserForm({ username: '', email: '', phone: '', address: '', password: '', user_profile: null });
      setNewUser(null);
      setNewUserValidationErrors({});
      setNewUserBackendErrors({});
    } catch (error) {
      const backendErrors = error.response?.data || { error: "An unexpected error occurred" };
      setNewUserBackendErrors(backendErrors);
      console.log("Failed to create user:", error);
    }
  };

  return (
    <div>
      {loading ? "Loading......" : users.map((user) => (
        <div key={user.id} className='w-full bg-gray-300 h-20 rounded-2xl flex m-1 justify-between px-1 items-center relative'>
          <div>{user.user_profile ? <img src={`http://localhost:8000${user.user_profile}`} className='w-25 h-full rounded-xl' alt="" /> : <div className='w-25 h-15 rounded-2xl text-center items-center flex justify-center text-sm bg-gray-50'>No image</div>}</div>
          <div>{user.username}</div>  
          {editingUser === user.id ? <>
            <input
              type="email"
              value={editForm.email}
              name="email"
              onChange={handleEditChange}
              className={`p-1 border rounded ${editValidationErrors.email ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              value={editForm.address}
              name="address"
              onChange={handleEditChange}
              className={`p-1 border rounded ${editValidationErrors.address ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleEditChange}
              className={`p-1 border rounded ${editValidationErrors.phone ? 'border-red-500' : ''}`}
            />
            <div className="h-full flex place-items-center">
              <button
                onClick={() => { editHandleSubmit(user.id) }}
                className="bg-green-500 hover:bg-green-700 w-20 h-1/2 rounded-xl mx-1"
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-500 hover:bg-gray-700 w-20 h-1/2 rounded-xl mx-1"
              >
                Cancel
              </button>
            </div>
            {(Object.keys(editValidationErrors).length > 0 || Object.keys(editBackendErrors).length > 0) && (
              <div className="text-red-500 text-sm absolute mt-16 w-full text-center">
                {Object.entries(editValidationErrors).map(([key, value]) => (
                  <p className='inline-block mx-1' key={key}>{value}</p>
                ))}
                {Object.entries(editBackendErrors).map(([key, value]) => (
                  <p className='inline-block mx-1' key={key}>
                    {Array.isArray(value) ? value.join(', ') : value}
                  </p>
                ))}
              </div>
            )}
          </> : <><div>{user.email}</div>
            <div>{user.address}</div>
            <div>{user.phone}</div>
            <div className='h-full flex place-items-center'>
              <button className='bg-blue-500 hover:bg-blue-700 w-20 h-1/2 rounded-xl' onClick={() => editingClickHandler(user)}>Edit</button>
              <button className='bg-red-400 hover:bg-red-600 w-20 h-1/2 rounded-xl m-1' onClick={() => handleDelete(user.id)}>Delete</button>
            </div></>}
        </div>
      ))}
      {!newUser && <div className='flex justify-center m-3'><span onClick={() => setNewUser(true)} className='text-xl hover:text-red-500'>Add a new user +</span></div>}
      {newUser && (
        <div className="w-full bg-gray-300 p-4 rounded-2xl flex flex-col m-1 items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <input
              type="file"
              name="user_profile"
              onChange={handleNewUserChange}
              className="p-2 border rounded w-full sm:w-1/3"
            />
            <input
              type="text"
              onChange={handleNewUserChange}
              name="username"
              placeholder="User Name"
              className={`p-2 border rounded w-full sm:w-1/3 ${newUserValidationErrors.username ? 'border-red-500' : ''}`}
            />
            <input
              type="email"
              onChange={handleNewUserChange}
              name="email"
              placeholder="Email"
              className={`p-2 border rounded w-full sm:w-1/3 ${newUserValidationErrors.email ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              onChange={handleNewUserChange}
              name="address"
              placeholder="Address"
              className={`p-2 border rounded w-full sm:w-1/3 ${newUserValidationErrors.address ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              name="phone"
              onChange={handleNewUserChange}
              placeholder="Phone Number"
              className={`p-2 border rounded w-full sm:w-1/3 ${newUserValidationErrors.phone ? 'border-red-500' : ''}`}
            />
            <input
              type="password"
              name="password"
              onChange={handleNewUserChange}
              placeholder="Password"
              className={`p-2 border rounded w-full sm:w-1/3 ${newUserValidationErrors.password ? 'border-red-500' : ''}`}
            />
          </div>
          {(Object.keys(newUserValidationErrors).length > 0 || Object.keys(newUserBackendErrors).length > 0) && (
            <div className="text-red-500 text-sm mt-2">
              {Object.entries(newUserValidationErrors).map(([key, value]) => (
                <p key={key}>{value}</p>
              ))}
              {Object.entries(newUserBackendErrors).map(([key, value]) => (
                <p key={key}>
                  {Array.isArray(value) ? value.join(', ') : value}
                </p>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
              onClick={handleNewUserSubmit}
            >
              Save
            </button>
            <button
              onClick={() => setNewUser(null)}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
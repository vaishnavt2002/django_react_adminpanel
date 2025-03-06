import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { createUser, deleteUser, getAllUser, updateUser } from '../API/Api';

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({email:'',phone:'',address:''})
  const [newUser, setNewUser] = useState(null)
  const [newUserForm, setNewUserForm] = useState({username:'',email:'',phone:'',address:'',password:'',user_profile:null})

  useEffect(() => {
    if (token) {
      const fetchUsers = async ()=> {
        try{
          setLoading(true)
          const response = await getAllUser();
          setUsers(response)
          
        }
        catch(error){
          console.log("Failed",error)
        }
        finally{
          setLoading(false)
        }
      }
      fetchUsers()
    }
  }, [token]);
  const editingClickHandler = (user)=>{
    setEditingUser(user.id)
    setEditForm({email:user.email,phone:user.phone,address:user.address})
  };
  const handleEditChange = (e)=> {
    setEditForm({...editForm,[e.target.name]:e.target.value})
  };
  const editHandleSubmit = async (userId)=>{
    try{
      const updatedUser = await updateUser(userId, editForm)
      setUsers(users.map((user)=>(user.id === userId ? updatedUser: user)))
      setEditingUser(null)
    }
    catch(error){
      console.log(error)
    }
  }
  const handleDelete = async (userId) => {
    if(window.confirm("Do you want to delete this user?")){
      try{
        await deleteUser(userId);
        setUsers(users.filter((user)=> user.id !== userId))

      }catch(error){
        console.log(error)
      }
    }
  }

  const handleNewUserChange = (e)=>{
    if (e.target.name == 'user_profile'){
      setNewUserForm({...newUserForm,user_profile:e.target.files[0]})
    }
    else{
      setNewUserForm({...newUserForm, [e.target.name]:e.target.value})
    }
  }
  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
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
      setNewUser(null)
    } catch (error) {
      console.log("Failed to create user:", error);
    }
  };
  return (
    <div>
      {loading?"Loading......":users.map((user) => (
        <div key={user.id} className='w-full bg-gray-300 h-20 rounded-2xl flex m-1 justify-between px-1 items-center'>
          <div>{user.user_profile?<img src={`http://localhost:8000${user.user_profile}`} className='w-25  h-full rounded-xl' alt="" />:<div className='w-25 h-15 rounded-2xl text-center items-center flex justify-center text-sm bg-gray-50'>No image</div>}</div><div>{user.username}</div>  
          {editingUser === user.id?<>
                <input
                  type="email"
                  value={editForm.email}
                  name="email"
                  onChange={handleEditChange}
                  className="p-1 border rounded"
                />
                <input
                  type="text"
                  value={editForm.address}
                  name="address"
                  onChange={handleEditChange}
                  className="p-1 border rounded"
                />
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleEditChange}
                  className="p-1 border rounded"
                />
                <div className="h-full flex place-items-center">
                  <button
                    onClick={() => {editHandleSubmit(user.id)}}
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
              </>:<><div>{user.email}</div>
          <div>{user.address}</div>
          <div>{user.phone}</div>
          <div className='h-full flex place-items-center'>
          <button className='bg-blue-500 hover:bg-blue-700 w-20 h-1/2 rounded-xl' onClick={()=>editingClickHandler(user)}>Edit</button>
          <button className='bg-red-400 hover:bg-red-600 w-20 h-1/2 rounded-xl m-1'onClick={()=>handleDelete(user.id)}>Delete</button>
          </div></>}
          

        </div>
      ))}
      {!newUser&&<div className='flex justify-center m-3'><span onClick={()=>setNewUser(true)} className='text-xl hover:text-red-500'>Add a new user +</span></div>}
      {newUser && (
        <div className="w-full bg-gray-300 p-4 rounded-2xl flex flex-col m-1 items-center gap-2">
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <input
              type="file"
              name="user_profile"
              onChange={handleNewUserChange}
              className="p-2 border rounded w-full sm:w-1/3 "
            />
            <input
              type="text"
              onChange={handleNewUserChange}
              name="username"
              placeholder="User Name"
              className="p-2 border rounded w-full sm:w-1/3"
            />
            <input
              type="email"
              onChange={handleNewUserChange}
              name="email"
              placeholder="Email"
              className="p-2 border rounded w-full sm:w-1/3"
            />
            <input
              type="text"
              onChange={handleNewUserChange}
              name="address"
              placeholder="Address"
              className="p-2 border rounded w-full sm:w-1/3"
            />
            <input
              type="text"
              name="phone"
              onChange={handleNewUserChange}
              placeholder="Phone Number"
              className="p-2 border rounded w-full sm:w-1/3"
            />
            <input
              type="password"
              name="password"
              onChange={handleNewUserChange}
              placeholder="Password"
              className="p-2 border rounded w-full sm:w-1/3"
            />
          </div>
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
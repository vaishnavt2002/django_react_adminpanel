import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearError, register } from '../redux/authSlice'

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        password: '',
        address: '',
        user_profile: null
    })
    const [url, setUrl] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})
    const { loading, error } = useSelector((state => state.auth))
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const validateForm = () => {
        const errors = {};

        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!formData.username.trim()) {
            errors.username = "Username is required";
        } else if (formData.username.length <= 4) {
            errors.username = "Username must be more than 4 characters";
        } else if (!usernameRegex.test(formData.username)) {
            errors.username = "Username can only contain letters and numbers";
        }

  

        const phoneRegex = /^[4-9][0-9]{9}$/;
        if (!formData.phone) {
            errors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = "Invalid Phone number";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length <= 6) {
            errors.password = "Password must be more than 6 characters";
        } else if (/\s/.test(formData.password)) {
            errors.password = "Password cannot contain spaces";
        }

        if (!formData.address) {
            errors.address = "Address is required";
        } else if (formData.address.length < 5) {
            errors.address = "Address must be 5 or more characters";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) {
            return;
        }
        
        const data = new FormData()
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('address', formData.address);
        data.append('password', formData.password);
        if (formData.user_profile) {
            data.append('user_profile', formData.user_profile);
        }
        const result = await dispatch(register(data)).unwrap();
        navigate('/')
    }

    const handleChange = (e) => {
        if (e.target.name === 'user_profile') {
            setFormData({ ...formData, user_profile: e.target.files[0] });
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                setUrl(url);
            } else {
                setUrl(null);
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.username ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.username && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
                    )}
                </div>

                <div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.email ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.email && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone (10 digits)"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.phone ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.phone && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                    )}
                </div>

                <div>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.address ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.address}</p>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validationErrors.password ? 'border-red-500' : ''
                        }`}
                    />
                    {validationErrors.password && (
                        <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                    )}
                </div>

                <input
                    type="file"
                    name="user_profile"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {url && (
                    <div className="mt-4">
                        <img
                            src={url}
                            alt="Profile Preview"
                            className="w-full max-w-xs rounded shadow"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            {error && (
                <div className="text-red-500 mt-2">
                    {Object.entries(error).map(([key, value]) => (
                        <p key={key}>
                            <strong>{key}:</strong> {value}
                        </p>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Register
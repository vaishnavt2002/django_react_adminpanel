import axiosInstance from "../AxiosInstance"

export const getAllUser =async ()=>{
    try{
        const response = await axiosInstance.get('api/admin/users')
        return response.data
    }
    catch(error){
        console.log("Error on retriving user data: ",error.response?.data||error)
        throw error
    }
}

export const updateUser = async (userId,userData)=>{
    try{
        const response = await axiosInstance.put(`api/admin/users/${userId}/`,userData);
        return response.data
    }
    catch(error){
        throw error;
    }
}

export const updateProfile = async (userData) =>{
    try{
        const response = await axiosInstance.put('api/profile/',userData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            }});
        return response.data
    }
    catch(error){
        throw error
    }
}

export const deleteUser = async (userId)=>{
    try{
        const response = await axiosInstance.delete(`api/admin/users/${userId}/delete/`)
        return response.data
    }
    catch(error){
        throw error;
    }
}

export const createUser = async (formData)=>{
    try{
        const response = await axiosInstance.post('api/register/',formData,{
            headers: {
              'Content-Type': 'multipart/form-data',
            }})
        return response.data
    }catch(error){
        throw error
    }
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hooks/useAxios';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const [profilePic, setProfilePic] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from || '/';
    const axiosInstance = useAxios();
    const [showPassword, setShowPassword] = useState(false);



    const onSubmit = data => {

        console.log(data);

        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);


                const userInfo = {
                    email: data.email,
                    name: data.name,
                    role: 'user',
                    image: profilePic,
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString()
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);


                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('profile name pic updated');
                        navigate(from);
                    })
                    .catch(error => {
                        console.log(error)
                    })

            })
            .catch(error => {
                console.error(error);
            })
    }

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        console.log(image)

        const formData = new FormData();
        formData.append('image', image);


        const imagUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
        const res = await axios.post(imagUploadUrl, formData)

        setProfilePic(res.data.data.url);


    }

    return (
 <div className="h-[87vh] flex justify-center items-center px-4">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body ">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">


                        <label className="label">Upload Image</label>
                        <div className="flex flex-col items-center gap-2">
                            <label className="cursor-pointer group">
                                {profilePic ? (
                                    <img
                                        src={profilePic}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 group-hover:opacity-80 transition"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 group-hover:bg-gray-300 transition">
                                        Upload
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>





                        <label className="label">Your Name</label>
                        <input type="text"
                            {...register('name', { required: true })}
                            className="input" placeholder="Your Name" required />
                        {
                            errors.email?.type === 'required' && <p className='text-red-500'>Name is required</p>
                        }




                        <label className="label">Email</label>
                        <input type="email"
                            {...register('email', { required: true })}
                            className="input" placeholder="Email"
                            required
                        />
                        {
                            errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
                        }

                        <label className="label">Password</label>
                        <label className="label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", {
                                    required: true,
                                    minLength: 6,
                                    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
                                })}
                                className="input w-full pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg text-gray-500 hover:text-black"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {errors.password?.type === 'required' && (
                            <p className="text-red-500">Password is required</p>
                        )}
                        {errors.password?.type === 'minLength' && (
                            <p className="text-red-500">Password must be at least 6 characters</p>
                        )}
                        {errors.password?.type === 'pattern' && (
                            <p className="text-red-500">
                                Must include uppercase, number, and special character
                            </p>
                        )}


                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-primary text-black mt-4">Register</button>
                    </fieldset>
                    <p className="text-center mt-4 text-sm">
                        Already have an account?
                        <Link to="/login" state={{ from }} className="text-blue-600 font-semibold ml-1">
                            Login
                        </Link>
                    </p>

                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
       
     </div >    
    );
};

export default Register;
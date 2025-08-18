import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ProfilePage = () => {
    const { user } = useAuth();
    const axiosInstance = useAxiosSecure();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(`/users/${user.email}`);
                setProfileData(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        if (user?.email) fetchUser();
    }, [user?.email]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
      <div className=''>
          <div className="md:max-w-2xl md:mx-auto md:mt-20 mt-10 p-6 bg-white  rounded-lg shadow-md mx-4">
            <h1 className="text-2xl font-bold mb-6 text-center ">My Profile</h1>
            
            <div className="flex flex-col items-center mb-6">
                {profileData.photoURL ? (
                    <img
                        src={profileData.photoURL}
                        alt="Profile"
                        className="md:w-72 md:h-72 w-52 h-52 rounded-full object-cover border-2 border-gray-300"
                    />
                ) : (
                    <div className="md:w-72 md:h-72 w-52 h-52  rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                        <FaUserCircle size={48} />
                    </div>
                )}
            </div>

            <div className="space-y-4  ">
                <div>
                    <span className="font-semibold">Name: </span> {profileData.name || 'N/A'}
                </div>
                <div>
                    <span className="font-semibold">Email: </span> {profileData.email || 'N/A'}
                </div>
                <div>
                    <span className="font-semibold">Phone: </span> {profileData.phone || 'N/A'}
                </div>
                <div>
                    <span className="font-semibold">Address: </span> {profileData.address || 'N/A'}
                </div>
                <div>
                    <span className="font-semibold">Role: </span> {profileData.role || 'N/A'}
                </div>
                <div>
                    <span className="font-semibold">Badge: </span> {profileData.badge || 'N/A'}
                </div>
                <div>
                    <span className="font-semibold">Last Log In: </span> {new Date(profileData.last_log_in).toLocaleString() || 'N/A'}
                </div>
            </div>
        </div>
      </div>
    );
};

export default ProfilePage;

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';

const AdminProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosInstance = useAxios();

    const { data: userInfo, isLoading, error } = useQuery({
        enabled: !!user?.email && !authLoading,
        queryKey: ['currentUser', user?.email],
        queryFn: async () => {
            const res = await axiosInstance.get(`/users/${user.email}`);
            return res.data;
        }
    });

    if (authLoading || isLoading) {
        return <div className="text-center p-6"><span className="loading loading-ring loading-sm"></span></div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">Failed to load profile.</div>;
    }


    const displayName = (userInfo?.name || user?.displayName || 'User').toUpperCase();

    const photoURL = userInfo?.photoURL || user?.photoURL || 'https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png';
    const email = userInfo?.email || user?.email || 'No email';
    const mealsAdded = userInfo?.mealsAdded ?? 0;
    const badge = userInfo?.badge || 'User'

    return (
        <div className="w-full bg-orange-200 py-6 text-center space-y-4">
            <div>
                <img
                    src={photoURL}
                    alt="Avatar"
                    className="w-24 h-24 mx-auto rounded-full object-cover border border-green-500"
                />
            </div>
            <div>
                <h2 className=" font-semibold text-gray-800 "> <span className='text-xl'>{displayName}</span>{' '} <span className='text-md '>({badge})</span></h2>
                <p className="text-gray-500">{email}</p>
                <div className="mt-4 bg-indigo-100 text-primary rounded-full px-4 py-2 inline-block text-sm font-medium">
                    Meals Added: {mealsAdded}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;

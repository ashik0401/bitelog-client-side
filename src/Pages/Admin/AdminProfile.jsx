import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const AdminProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: mealCountData = { count: 0 }, isLoading: mealCountLoading, error } = useQuery({
        enabled: !!user?.email && !authLoading,
        queryKey: ['mealCount', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals/count/${user.email}`);
            return res.data;
        }
    });

    const { data: userInfo = {}, isLoading: userInfoLoading } = useQuery({
        enabled: !!user?.email && !authLoading,
        queryKey: ['userInfo', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        }
    });

    if (authLoading || !user?.email || mealCountLoading || userInfoLoading) {
        return <div className="text-center p-6"><span className="loading loading-ring loading-sm"></span></div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">Failed to load meal count.</div>;
    }

    const displayName = (user.displayName || 'User').toUpperCase();
    const photoURL = user.photoURL || 'https://i.ibb.co/V0bwF2W1/User-Profile-PNG-High-Quality-Image.png';
    const email = user.email || 'No email';
    const mealsAdded = mealCountData.count;
    const badge = userInfo.badge || 'Bronze';
    const role = userInfo.role;

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
                <h2 className="font-semibold text-gray-800">
                    <span className="text-xl">{displayName}</span>{' '}
                    {role === 'user' && <span className="text-md">({badge})</span>}
                </h2>
                <p className="text-gray-500">{email}</p>
                {
                    role === 'admin' && <div className="mt-4 bg-indigo-100 text-primary rounded-full px-4 py-2 inline-block text-sm font-medium">
                        Meals Added: {mealsAdded}
                    </div>
                }
            </div>
        </div>
    );
};

export default AdminProfile;

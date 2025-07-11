import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const formatDate = (iso) => {
    if (!iso) return 'Invalid date';
    return new Date(iso).toLocaleString();
};

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: payments = [] } = useQuery({
        enabled: !!user?.email,
        queryKey: ['user-payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        }
    });

    if (isPending) {
        return <span className="loading loading-ring loading-md"></span>;
    }

    return (
        <div className="overflow-x-auto shadow-md rounded-xl mt-6">
            <table className="table table-zebra w-full">
                <thead className="bg-base-200 text-base font-semibold">
                    <tr>
                        <th>#</th>
                        <th>Membership ID</th>
                        <th>Amount</th>
                        <th>Transaction</th>
                        <th>Paid At</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((p, index) => (
                            <tr key={p.transactionId}>
                                <td>{index + 1}</td>
                                <td className="truncate" title={p.membershipId}>
                                    {String(p.membershipId).slice(0, 8)}...
                                </td>
                                <td>৳{p.amount}</td>
                                <td className="font-mono text-sm" title={p.transactionId}>
                                    {p.transactionId.slice(0, 10)}...
                                </td>
                                <td>{formatDate(p.paid_at_string)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-gray-500 py-6">
                                No payment history found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentHistory;

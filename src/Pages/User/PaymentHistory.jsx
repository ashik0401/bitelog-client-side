import React, { useState } from 'react';
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
  const [page, setPage] = useState(1);
  const limit = 10;

  const { isLoading, data = {} } = useQuery({
    enabled: !!user?.email,
    queryKey: ['user-payments', user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}&page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const payments = data.payments || [];
  const totalCount = data.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return <span className="loading loading-ring loading-md"></span>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-xl mt-6 mx-5">
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
                <td>{(page - 1) * limit + index + 1}</td>
                <td className="truncate" title={p.membershipId}>
                  {String(p.membershipId)}...
                </td>
                <td>${p.amount}</td>
                <td className="font-mono text-sm" title={p.transactionId}>
                  {p.transactionId}...
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
      {totalPages > 1 && (
        <div className="btn-group mt-4 justify-center">
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn ${page === i + 1 ? 'btn-active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

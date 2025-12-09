import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Pagination from '../../Components/Pagination/Pagination';

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

  if (isLoading) {
    return <span className="loading loading-ring loading-md"></span>;
  }

  return (
    <div className="mt-6 mx-5">
      <div className="overflow-x-auto sm:overflow-x-visible shadow-md rounded-xl">
        <table className="table  w-full whitespace-nowrap">
          <thead className=" text-base font-semibold">
            <tr className='text-black bg-green-100'>
              <th>#</th>
              <th>Membership ID</th>
              <th>Amount</th>
              <th className='text-center'>Transaction</th>
              <th className='text-center'>Paid At</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((p, index) => (
                <tr 
                className=''
                key={p.transactionId}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td className="truncate" title={p.membershipId}>
                    {String(p.membershipId)}...
                  </td>
                  <td className='text-center'>${p.amount}</td>
                  <td className="font-mono text-sm" title={p.transactionId}>
                    {p.transactionId}...
                  </td>
                  <td>{formatDate(p.paid_at_string)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6 ">
                  No payment history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalCount > limit && (
        <Pagination
          totalItems={totalCount}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default PaymentHistory;

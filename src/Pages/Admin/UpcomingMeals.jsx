import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router'
import Pagination from '../../Components/Pagination/Pagination'

const itemsPerPage = 10

const UpcomingMeals = () => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)

  const { data = {}, isLoading } = useQuery({
    queryKey: ['upcomingMeals', currentPage],
    queryFn: async () => {
      const res = await axiosSecure.get('/upcoming-meals', {
        params: { page: currentPage, limit: itemsPerPage }
      })
      return res.data
    }
  })

  const publishMeal = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.post(`/publish-meal/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['upcomingMeals', currentPage])
      Swal.fire({
        icon: 'success',
        title: 'Meal has been published!',
        showConfirmButton: false,
        timer: 1500
      })
      navigate('/dashboard')
    },
    onError: () => {
      Swal.fire({
        icon: 'error',
        title: 'Failed to publish meal.',
        showConfirmButton: false,
        timer: 1500
      })
    }
  })

  const meals = data.meals || []
  const totalCount = data.totalCount || 0
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  if (isLoading) return <div className="p-6 text-center"><span className="loading loading-ring loading-sm"></span>
</div>

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">Upcoming Meals</h2>
      <Link to="/dashboard/addUpcomingMeal">
        <button className="btn bg-primary my-2">Add meal</button>
      </Link>

      <div className="overflow-x-auto shadow-xl border border-gray-400 rounded-xl">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th className="text-center border-gray-400 border">#</th>
              <th className="text-center border-gray-400 border">Title</th>
              <th className="text-center border-gray-400 border">Distributor</th>
              <th className="text-center border-gray-400 border">Likes</th>
              <th className="text-center border-gray-400 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal, index) => (
              <tr key={meal._id}>
                <td className="text-center border border-gray-300">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="text-center border border-gray-300">{meal.title}</td>
                <td className="text-center border border-gray-300">{meal.distributorName?.toUpperCase()}</td>
                <td className="text-center border border-gray-300">{meal.likes}</td>
                <td className="text-center border border-gray-300">
                  <button
                    onClick={() => publishMeal.mutate(meal._id)}
                    className="btn bg-primary text-white btn-sm"
                  >
                    Publish
                  </button>
                </td>
              </tr>
            ))}
            {meals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">No upcoming meals</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default UpcomingMeals

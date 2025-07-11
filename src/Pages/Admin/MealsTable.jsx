import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../hooks/useAxiosSecure'

const MealsTable = () => {
  const [sortBy, setSortBy] = useState('postTime')
  const [order, setOrder] = useState('desc')
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ['meals', sortBy, order],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals?sortBy=${sortBy}&order=${order}`)
      return res.data
    }
  })

  const deleteMeal = async (id) => {
    const confirmed = await Swal.fire({
      title: 'Confirm delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    })
    if (!confirmed.isConfirmed) return
    await axiosSecure.delete(`/meals/${id}`)
    Swal.fire('Deleted!', '', 'success')
    queryClient.invalidateQueries(['meals'])
  }

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setOrder('desc')
    }
  }

  if (isLoading) return <div className='flex items-center justify-center h-screen'><span className="loading loading-ring loading-md "></span></div>

  return (
    <div className="p-4 mt-5">
      <div className="flex gap-4 mb-2">
       
        <button className="btn btn-sm" onClick={() => handleSortChange('likes')}>
          Sort by Likes {sortBy === 'likes' ? (order === 'asc' ? '↑' : '↓') : ''}
        </button>
        <button className="btn btn-sm" onClick={() => handleSortChange('reviews_count')}>
          Sort by Reviews {sortBy === 'reviews_count' ? (order === 'asc' ? '↑' : '↓') : ''}
        </button>
      </div>
      <div className="overflow-x-auto  shadow-xl border border-gray-200 rounded-xl">
        <table className="table w-full">
          <thead>
            <tr>
              <th className=' text-center'>Title</th>
              <th className=' text-center'>Likes</th>
              <th className=' text-center'>Reviews</th>
              <th className=' text-center'>Rating</th>
              <th className=' text-center'>Distributor</th>
              <th className=' text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meals.map((meal) => (
              <tr key={meal._id}>
                <td className=' text-center font-bold'>{meal.title}</td>
                <td className=' text-center'>{meal.likes}</td>
                <td className=' text-center'>{meal.reviews_count}</td>
                <td className=' text-center'>{meal.rating}</td>
                <td className=' text-center'>{meal.distributorName.toUpperCase()}</td>
                <td className="space-x-2 flex items-center justify-center md:text-center  ">
                  <Link to={`/Meals/${meal._id}`}>
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => navigate(`/dashboard/meals/${meal._id}`)}
                    >
                      View
                    </button>
                  </Link>
                  <button
                    className="btn btn-xs btn-warning"
                    onClick={() => navigate(`/dashboard/updateMeals/${meal._id}`)}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => deleteMeal(meal._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MealsTable

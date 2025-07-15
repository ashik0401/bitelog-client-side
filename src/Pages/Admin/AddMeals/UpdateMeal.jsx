import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import axios from 'axios'
import useAuth from '../../../hooks/useAuth'

const UpdateMeal = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [imageURL, setImageURL] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const axiosSecure = useAxiosSecure()

  const fetchMealById = async (id) => {
    const res = await axiosSecure.get(`/meals/${id}`)
    return res.data?.meal || res.data
  }

  const { data: meal, isLoading, error } = useQuery({
    queryKey: ['meal', id],
    queryFn: () => fetchMealById(id),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (meal) {
      reset({
        title: meal.title || '',
        category: meal.category || '',
        ingredients: Array.isArray(meal.ingredients) 
          ? meal.ingredients.join(', ') 
          : meal.ingredients || '',
        description: meal.description || '',
        price: meal.price || 0,
      })
      setImageURL(meal.image || null)
    }
  }, [meal, reset])

  const handleImageUpload = async (e) => {
    const image = e.target.files[0]
    const formData = new FormData()
    formData.append('image', image)
    setIsUploading(true)
    try {
      const imgbbUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
      const res = await axios.post(imgbbUrl, formData)
      setImageURL(res.data.data.url)
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Image Upload Failed!',
        text: 'Try uploading a different image.',
        showConfirmButton: false,
        timer: 1500
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data) => {
    const updatedMeal = {
      ...data,
      image: imageURL,
      ingredients: data.ingredients.split(',').map((i) => i.trim()),
      updatedAt: new Date(),
    }
    try {
      await axiosSecure.put(`/meals/${id}`, updatedMeal)
      Swal.fire({
        icon: 'success',
        title: 'Meal updated successfully!',
        showConfirmButton: false,
        timer: 1500
      })
      navigate('/dashboard')
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  if (error) return <div className="text-center py-10">Error loading meal data</div>
  if (isLoading) return <div className='flex justify-center items-center h-64'><span className="loading loading-spinner loading-lg"></span></div>

  return (
    <div className="md:max-w-xl md:mx-auto p-6 bg-orange-100 rounded shadow-xl mt-20 mx-5">
      <h2 className="text-3xl font-bold mb-4 text-center">Update Meal</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="text" {...register('title', { required: true })} placeholder="Meal Title" className="input input-bordered w-full" />
        {errors.title && <p className="text-red-500">Title is required</p>}

        <select {...register('category', { required: true })} className="select select-bordered w-full">
          <option value="">Select Category</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
        </select>
        {errors.category && <p className="text-red-500">Category is required</p>}

        <input type="file" onChange={handleImageUpload} className="file-input file-input-bordered w-full" />
        {imageURL && <img src={imageURL} alt="Meal" className="h-24 w-24 object-cover mt-2" />}

        <input type="text" {...register('ingredients', { required: true })} placeholder="Ingredients (comma separated)" className="input input-bordered w-full" />
        {errors.ingredients && <p className="text-red-500">Ingredients are required</p>}

        <textarea {...register('description', { required: true })} placeholder="Description" className="textarea textarea-bordered w-full" />
        {errors.description && <p className="text-red-500">Description is required</p>}

        <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price" className="input input-bordered w-full" />
        {errors.price && <p className="text-red-500">Price is required</p>}

        <input type="text" value={user?.displayName} readOnly className="input input-bordered w-full bg-gray-100" />
        <input type="email" value={user?.email} readOnly className="input input-bordered w-full bg-gray-100" />

        <button type="submit" className="btn btn-primary w-full" disabled={isUploading}>
          {isUploading ? 'Updating...' : 'Update Meal'}
        </button>
      </form>
    </div>
  )
}

export default UpdateMeal

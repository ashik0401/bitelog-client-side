import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQueryClient } from '@tanstack/react-query';

const AddMeal = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [imageURL, setImageURL] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const meal = {
        title: data.title,
        category: data.category,
        image: imageURL,
        ingredients: data.ingredients.split(','),
        description: data.description,
        price: parseFloat(data.price),
        postTime: new Date().toISOString(),
        distributorName: user?.displayName,
        distributorEmail: user?.email,
        rating: 0,
        likes: 0,
        reviews_count: 0,
      };

      await axiosSecure.post('/meals', meal);
      queryClient.invalidateQueries(['user', user?.email]);
      Swal.fire({
        icon: 'success',
        title: 'Meal added successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      reset();
      setImageURL('');
    } catch (err) {
      console.log(err);
      
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong. Please try again.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append('image', image);

    try {
      const imgbbUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
      const res = await axios.post(imgbbUrl, formData);
      setImageURL(res.data.data.url);
    } catch (error) {
      console.log(error);
      
      Swal.fire({
        icon: 'error',
        title: 'Image upload failed. Try a different image.',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <div className="md:max-w-xl md:mx-auto p-6 dark:bg-transparent rounded shadow-xl mt-25 mx-5 dark:text-white bg-green-100 dark:bg-transparent">
      <h2 className="text-3xl font-bold mb-4 text-center">Add New Meal</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 t">
        <input type="text" {...register('title', { required: true })} placeholder="Meal Title" className="input input-bordered w-full bg-gray-200 dark:bg-transparent" />
        {errors.title && <p className="text-red-500">Title is required</p>}

        <select {...register('category', { required: true })} className="select select-bordered w-full bg-gray-200 dark:bg-transparent ">
          <option className='text-black' value="">Select Category</option>
          <option className='text-black' value="Breakfast">Breakfast</option>
          <option className='text-black' value="Lunch">Lunch</option>
          <option className='text-black' value="Dinner">Dinner</option>
        </select>
        {errors.category && <p className="text-red-500">Category is required</p>}

        <input type="file" onChange={handleImageUpload} className="file-input file-input-bordered w-full bg-gray-200 dark:bg-transparent" />
        {imageURL && <img src={imageURL} alt="Meal" className="h-25 w-25 object-cover mt-2" />}

        <input type="text" {...register('ingredients', { required: true })} placeholder="Ingredients (comma separated)" className="input input-bordered w-full bg-gray-200 dark:bg-transparent" />
        {errors.ingredients && <p className="text-red-500">Ingredients are required</p>}

        <textarea {...register('description', { required: true })} placeholder="Description" className="textarea textarea-bordered w-full bg-gray-200 dark:bg-transparent" />
        {errors.description && <p className="text-red-500">Description is required</p>}

        <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price" className="input input-bordered w-full bg-gray-200 dark:bg-transparent" />
        {errors.price && <p className="text-red-500">Price is required</p>}

        <input type="text" value={user?.displayName} readOnly className="input input-bordered w-full bg-gray-200 dark:bg-transparent   " />
        <input type="email" value={user?.email} readOnly className="input input-bordered w-full bg-gray-200 dark:bg-transparent " />

        <button type="submit" className="btn  w-full bg-[#012200] dark:bg-[#0ec708] border-gray-500 dark:border-none dark:text-white ">Add Meal</button>
      </form>
    </div>
  );
};

export default AddMeal;
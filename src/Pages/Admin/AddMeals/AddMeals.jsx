import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddMeal = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
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
      Swal.fire({
        title: 'Success!',
        text: 'Meal added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      reset();
      setImageURL('');
    } catch (err) {
      console.error('Error adding meal:', err);
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
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
      console.error('Image upload failed:', error);
      Swal.fire({
        title: 'Image Upload Failed!',
        text: 'Try uploading a different image.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-orange-100 rounded shadow mt-15">
      <h2 className="text-3xl font-bold mb-4 text-center">Add New Meal</h2>
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
        {imageURL && <img src={imageURL} alt="Meal" className="h-25 w-25 object-cover mt-2" />}

        <input type="text" {...register('ingredients', { required: true })} placeholder="Ingredients (comma separated)" className="input input-bordered w-full" />
        {errors.ingredients && <p className="text-red-500">Ingredients are required</p>}

        <textarea {...register('description', { required: true })} placeholder="Description" className="textarea textarea-bordered w-full" />
        {errors.description && <p className="text-red-500">Description is required</p>}

        <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price" className="input input-bordered w-full" />
        {errors.price && <p className="text-red-500">Price is required</p>}

        <input type="text" value={user?.displayName} readOnly className="input input-bordered w-full bg-gray-100" />
        <input type="email" value={user?.email} readOnly className="input input-bordered w-full bg-gray-100" />

        <button type="submit" className="btn btn-primary w-full">Add Meal</button>
      </form>
    </div>
  );
};

export default AddMeal;

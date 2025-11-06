import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FaTags, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { Link } from 'react-router'

const fetchMeals = async ({ pageParam = 1, queryKey }) => {
  const [, { search, category, sortBy, order }, axiosSecure] = queryKey
  const res = await axiosSecure.get('/meals', {
    params: { page: pageParam, limit: 10, search, category, sortBy, order },
  })
  const meals = Array.isArray(res.data.meals) ? res.data.meals : []
  const hasNext = meals.length === 10
  return { meals, nextPage: hasNext ? pageParam + 1 : undefined }
}

const calculateAverageRating = (ratings) => {
  if (!ratings) return 0
  const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0)
  if (totalRatings === 0) return 0
  const totalScore = Object.entries(ratings).reduce(
    (acc, [star, count]) => acc + Number(star) * count,
    0
  )
  return totalScore / totalRatings
}

const renderStars = (rating) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400 inline-block" />)
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline-block" />)
    else stars.push(<FaRegStar key={i} className="text-gray-400 dark:text-gray-600 inline-block" />)
  }
  return stars
}

const Meals = () => {
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('postTime')
  const [order, setOrder] = useState('desc')
  const [categories, setCategories] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    axiosSecure.get('/meal-categories').then(res => setCategories(res.data))
  }, [axiosSecure])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['meals', { search, category, sortBy, order }, axiosSecure],
    queryFn: fetchMeals,
    getNextPageParam: lastPage => lastPage.nextPage,
    enabled: !!axiosSecure,
  })

  const handleSearch = () => {
    setSearch(input)
    refetch()
  }

  const handleCategoryChange = value => {
    setCategory(value)
    refetch()
  }

  const handlePriceSortChange = value => {
    if (value === 'asc') {
      setSortBy('price')
      setOrder('asc')
    } else if (value === 'desc') {
      setSortBy('price')
      setOrder('desc')
    } else {
      setSortBy('postTime')
      setOrder('desc')
    }
    refetch()
  }

  const allMeals = data?.pages?.flatMap(page => page.meals) || []

  return (
    <div className="p-4 lg:w-10/12 mx-auto pt-15">
      <div className="flex flex-col md:flex-row-reverse gap-3 mb-4 md:w-11/12 mx-auto mt-10">
        <div className="flex gap-2 w-full">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            type="text"
            placeholder="Search by title"
            className="border p-2 w-full mx-auto rounded border-black text-black dark:border-gray-500 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="bg-[#066303] hover:bg-[#043f02] text-white px-4 rounded border-none btn dark:border-gray-500"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 sm:hidden items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-sm btn-outline text-white bg-[#012200] hover:bg-[#015500] hover:text-white dark:border-gray-500"
          >
            <FaTags /> Filters
          </button>
        </div>

        <select
          value={category}
          onChange={e => handleCategoryChange(e.target.value)}
          className={`border border-black text-black dark:border-white dark:text-white rounded p-2 w-full sm:w-1/4 ${showFilters ? '' : 'hidden sm:block'}`}
        >
          <option value="" className="dark:text-black">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat} className="dark:text-black">{cat}</option>
          ))}
        </select>

        <select
          value={sortBy === 'price' ? order : ''}
          onChange={e => handlePriceSortChange(e.target.value)}
          className={`border border-black text-black dark:border-white dark:text-white rounded p-2 w-full sm:w-1/4 ${showFilters ? '' : 'hidden sm:block'}`}
        >
          <option value="" className="dark:text-black">Sort by Price</option>
          <option value="asc" className="dark:text-black">Low to High</option>
          <option value="desc" className="dark:text-black">High to Low</option>
        </select>
      </div>

      <InfiniteScroll
        dataLength={allMeals.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={isFetchingNextPage && (
          <p className="text-center"><span className="loading loading-ring loading-sm"></span></p>
        )}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-10 md:w-11/12 mx-auto mt-10">
          {allMeals.map(meal => {
            const avgRating = calculateAverageRating(meal.ratings)
            return (
              <div
                key={meal._id}
                className="card rounded-2xl text-black dark:text-white shadow-xl dark:bg-transparent h-full flex flex-col border dark:border-gray-500 border-gray-100 w-full sm:max-w-[300px] mx-auto"
              >
                <figure>
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="w-full md:h-52 h-48 sm:h-58 object-cover rounded-t-2xl"
                  />
                </figure>

                <div className="card-body flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1">
                      {renderStars(avgRating)}
                    </div>
                    <h2 className="card-title text-lg md:text-xl font-bold mb-1 line-clamp-2">
                      {meal.title}
                    </h2>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="font-bold text-xl">${meal.price}</p>

                    <Link to={`/Meals/${meal._id}`}>
                      <button className="flex items-center justify-between cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                          />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </InfiniteScroll>

      {isLoading && !allMeals.length && (
        <p className="text-center mt-10 text-lg text-primary h-screen flex justify-center items-center">
          <span className="loading loading-ring loading-md"></span>
        </p>
      )}
    </div>
  )
}

export default Meals

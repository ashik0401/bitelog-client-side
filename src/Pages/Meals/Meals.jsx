import React, { useState, useEffect } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FaTags } from 'react-icons/fa'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { Link } from 'react-router'

const fetchMeals = async ({ pageParam = 1, queryKey }) => {
  const [, { search, category, priceRange }] = queryKey
  const axiosSecure = queryKey[2]
  const res = await axiosSecure.get('/meals', {
    params: {
      page: pageParam,
      limit: 10,
      search,
      category,
      priceRange,
    },
  })

  const meals = Array.isArray(res.data.meals) ? res.data.meals : res.data
  const hasNext = meals.length === 10

  return {
    meals,
    nextPage: hasNext ? pageParam + 1 : undefined,
  }
}

const Meals = () => {
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [categories, setCategories] = useState([])
  const [priceRanges, setPriceRanges] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const axiosSecure = useAxiosSecure()

  useEffect(() => {
    axiosSecure.get('/meal-categories').then(res => setCategories(res.data))
    axiosSecure.get('/price-ranges').then(res => setPriceRanges(res.data))
  }, [axiosSecure])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['meals', { search, category, priceRange }, axiosSecure],
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

  const handlePriceChange = value => {
    setPriceRange(value)
    refetch()
  }

  const allMeals =
    data?.pages?.flatMap(page => Array.isArray(page.meals) ? page.meals : []) || []

  return (
    <div className="p-4 mx-auto pt-15">
      <div className="flex flex-col md:flex-row-reverse gap-3 mb-4 md:w-11/12 mx-auto mt-10">
        <div className="flex gap-2 w-full">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            type="text"
            placeholder="Search by title"
            className="border p-2 w-full mx-auto rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
        <div className="flex gap-2 sm:hidden items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-sm btn-outline text-primary"
          >
            <FaTags /> Filters
          </button>
        </div>

        <select
          value={category}
          onChange={e => handleCategoryChange(e.target.value)}
          className={`border rounded p-2 w-full sm:w-1/4 ${showFilters ? '' : 'hidden sm:block'}`}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={priceRange}
          onChange={e => handlePriceChange(e.target.value)}
          className={`border rounded p-2 w-full sm:w-1/4 ${showFilters ? '' : 'hidden sm:block'}`}
        >
          <option value="">All Prices</option>
          {priceRanges.map((pr, i) => (
            <option key={i} value={pr.value}>{pr.label}</option>
          ))}
        </select>
      </div>

      <InfiniteScroll
        dataLength={allMeals.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={isFetchingNextPage && <p className="text-center">Loading more meals...</p>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:w-11/12 mx-auto mt-10">
          {allMeals.map(meal => (
            <div
              key={meal._id}
              className="card shadow-xl bg-orange-100 border border-gray-200"
            >
              <figure>
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{meal.title}</h2>
                <p>⭐ Rating: {
                  (() => {
                    const ratings = meal.ratings || {};
                    const totalRatings = Object.values(ratings).reduce((a, b) => a + b, 0);
                    if (totalRatings === 0) return 0;
                    const totalScore = Object.entries(ratings).reduce(
                      (acc, [star, count]) => acc + Number(star) * count, 0
                    );
                    return (totalScore / totalRatings).toFixed(1);
                  })()
                }</p>
                <p>💰 Price: ${meal.price}</p>
                <div className="card-actions justify-end">
                  <Link to={`/Meals/${meal._id}`}>
                    <button className="btn btn-sm btn-primary">Details</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {isLoading && !allMeals.length && (
        <p className="text-center mt-10 text-lg text-primary">Loading meals...</p>
      )}
    </div>
  )
}

export default Meals

import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Link } from "react-router";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const getStars = (ratings) => {
  const totalRatings = Object.values(ratings || {}).reduce((a, b) => a + b, 0);
  const stars = [];

  if (totalRatings === 0) {
    for (let i = 1; i <= 5; i++)
      stars.push(
        <FaRegStar
          key={i}
          className="text-gray-400 dark:text-gray-600 inline-block"
        />
      );
  } else {
    const totalScore = Object.entries(ratings).reduce(
      (acc, [star, count]) => acc + Number(star) * count,
      0
    );
    const average = totalScore / totalRatings;
    for (let i = 1; i <= 5; i++) {
      if (average >= i)
        stars.push(<FaStar key={i} className="text-yellow-400 inline-block" />);
      else if (average >= i - 0.5)
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 inline-block" />
        );
      else
        stars.push(
          <FaRegStar
            key={i}
            className="text-gray-400 dark:text-gray-600 inline-block"
          />
        );
    }
  }

  return stars;
};

const MealsByCategory = ({ searchTerm }) => {
  const [category, setCategory] = useState("Breakfast");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setLoading(true);
    const fetchMeals = async () => {
      try {
        const res = await axiosSecure.get("/meals", {
          params: { search: searchTerm },
        });
        const data = Array.isArray(res.data.meals) ? res.data.meals : res.data;
        setMeals(data);
      } catch {
        setMeals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, [axiosSecure, searchTerm]);

  const filteredMeals = meals.filter((meal) => meal.category === category);
  const mealsToShow = showAll ? filteredMeals : filteredMeals.slice(0, 8);

  if (loading) {
    return (
      <div className="text-center my-10 text-xl font-semibold text-primary">
        <span className="loading loading-ring loading-sm"></span>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 lg:w-10/12 mx-auto">
      <h2 className="text-3xl font-bold  text-center text-[#012200] mb-15 dark:text-white">
        Meals
      </h2>

      <div role="tablist" className="tabs tabs-boxed justify-center mb-6">
        {[
          {
            name: "Breakfast",
            img: "https://i.ibb.co/2Y6wTWhM/recipe-gourmet-and-healthy-breakfast-soignon.jpg",
          },
          {
            name: "Lunch",
            img: "https://i.ibb.co/G3Qw6PHM/mexican-lunch-bowls-3.jpg",
          },
          {
            name: "Dinner",
            img: "https://i.ibb.co/Mx2BZy57/EWL-one-skillet-garlicky-salmon-and-broccoli-beauty-537-preview-max-Width-4000-max-Height-4000-ppi-3.jpg",
          },
        ].map((tab) => (
          <button
            key={tab.name}
            onClick={() => setCategory(tab.name)}
            className={`sm:mx-5 mx-2 cursor-pointer border rounded-t-full flex flex-col items-center text-black dark:text-white ${
              category === tab.name
                ? "tab-active text-white font-bold"
                : "border-2 border-[#013100] font-bold"
            }`}
          >
            <img
              src={tab.img}
              alt={tab.name}
              className="md:w-40 md:h-40 sm:w-30 sm:h-30  object-contain rounded-t-full w-22 h-22 "
            />
            <span className="bg-[#012200] w-full py-2 text-white font-normal flex-1">
              {tab.name}
            </span>
          </button>
        ))}
      </div>

      {filteredMeals.length === 0 ? (
        <p className="text-center text-gray-600">No meals found.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-10 md:w-11/12 mx-auto mt-20">
            {mealsToShow.map((meal) => (
              <div
                key={meal._id}
                className="card rounded-2xl text-black dark:text-white shadow-xl dark:bg-transparent h-full flex flex-col border dark:border-gray-500 border-gray-100 w-full sm:max-w-[300px] mx-auto"
              >
                <figure>
                  <img
                    src={meal.image || null}
                    alt={meal.title}
                    className="w-full md:h-52 h-48 sm:h-58 object-cover rounded-t-2xl"
                  />
                </figure>
                <div className="card-body flex flex-col justify-between">
                  <div>
                    <p>{getStars(meal.ratings)}</p>
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
            ))}
          </div>

          {filteredMeals.length > 8 && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn btn-outline bg:[#012200]  text-white hover:bg-[015500]"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MealsByCategory;

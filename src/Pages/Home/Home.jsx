import React from 'react';
import Banner from '../../Components/Home/Banner';
import MealsByCategory from '../../Components/Home/MealsByCategory';
import MealDetails from '../../Components/Home/MealsDetails';

const Home = () => {
    return (
        <div>
            <Banner />
            <MealsByCategory />
            <MealDetails/>
        </div>
    );
};

export default Home;
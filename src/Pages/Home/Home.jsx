import React from 'react';
import Banner from '../../Components/Home/Banner';
import MealsByCategory from '../../Components/Home/MealsByCategory';

const Home = () => {
    return (
        <div>
            <Banner />
            <MealsByCategory />
        </div>
    );
};

export default Home;
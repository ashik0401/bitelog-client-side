import React from 'react';
import Banner from '../../Components/Home/Banner';
import MealsByCategory from '../../Components/Home/MealsByCategory';
import MembershipPackages from '../../Components/Home/MembershipPackages';
import MealDetail from '../Meals/MealDetail';

const Home = () => {
    return (
        <div>
            <Banner />
            <MealsByCategory />
            <MembershipPackages/>
        </div>
    );
};

export default Home;
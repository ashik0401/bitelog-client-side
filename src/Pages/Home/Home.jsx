import React from 'react';
import Banner from '../../Components/Home/Banner';
import MealsByCategory from '../../Components/Home/MealsByCategory';
import MealDetails from '../../Components/Home/MealsDetails';
import MembershipPackages from '../../Components/Home/MembershipPackages';

const Home = () => {
    return (
        <div>
            <Banner />
            <MealsByCategory />
            <MealDetails/>
            <MembershipPackages/>
        </div>
    );
};

export default Home;
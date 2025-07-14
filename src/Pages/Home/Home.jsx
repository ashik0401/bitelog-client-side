import React, { useState } from 'react';
import Banner from '../../Components/Home/Banner';
import MealsByCategory from '../../Components/Home/MealsByCategory';
import MembershipPackages from '../../Components/Home/MembershipPackages';
import StatsSection from '../../Components/Home/StatsSection';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div>
            <Banner onSearch={setSearchTerm} />
            <MealsByCategory searchTerm={searchTerm} />
            <MembershipPackages />
            <StatsSection />
        </div>
    );
};

export default Home;

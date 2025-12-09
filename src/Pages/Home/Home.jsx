import React, { useState } from 'react';
import Banner from '../../Components/Home/Banner';
import MealsByCategory from '../../Components/Home/MealsByCategory';
import MembershipPackages from '../../Components/Home/MembershipPackages';
import StatsSection from '../../Components/Home/StatsSection';
import { SalesPromotion } from '../../Components/Home/SalesPromotion';
import { Reviews } from '../../Components/Home/Reviews';
import { Newsletter } from '../../Components/Home/Newsletter';
import { FAQ } from '../../Components/Home/FAQ';


const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <div>
            
            <Banner onSearch={setSearchTerm} />
            <MealsByCategory searchTerm={searchTerm} />
            <MembershipPackages />
            <StatsSection />
            <SalesPromotion/>
            <Reviews/>
            <Newsletter/>
            <FAQ/>
        </div>
    );
};

export default Home;

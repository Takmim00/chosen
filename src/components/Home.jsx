import React from 'react';
import Banner from './Banner';
import SearchBid from './SearchBid';
import Opportunities from './Opportunities';
import OneSearch from './OneSearch';
import Pricing from './Pricing';

const Home = () => {
    return (
        <div>
            <Banner/>
            <SearchBid/>
            <Opportunities/>
            <OneSearch/>
            <Pricing/>
        </div>
    );
};

export default Home;
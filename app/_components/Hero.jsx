'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalApi from '@/app/_services/GlobalApi';
import FilterPopup from './FilterPopup';


function Hero() {
    const [query, setQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedService, setSelectedService] = useState('All');
    const [selectedCity, setSelectedCity] = useState('');
    const [minRating, setMinRating] = useState(0);

    const router = useRouter();

    const cities = [
        'Tunis', 'Sfax', 'Sousse', 'Ettadhamen', 'Kairouan', 'Gabès',
        'Bizerte', 'Ariana', 'La Marsa', 'Gafsa', 'Monastir', 'Tataouine',
        'Hammamet', 'Douz', 'Mahdia', 'Tozeur', 'Nabeul', 'Kasserine',
        'Ben Guerdane', 'Médenine', 'Kebili', 'Siliana', 'Beja', 'Jendouba'
    ];

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        GlobalApi.getCategory().then(resp => {
            setCategories(resp.categories);
        });
    };

    const handleApplyFilter = () => {
        const params = new URLSearchParams();
        if (selectedCity) params.set('city', selectedCity);
        if (minRating > 0) params.set('rating', minRating);

        const categoryPath = selectedService || 'all';
        const queryString = params.toString();

        setIsFilterOpen(false);
        router.push(`/search/${categoryPath}${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <div className='flex items-center flex-col justify-center pt-14 pb-7'>
            <h2 className='font-bold text-[46px] text-center'>
                Find Home
                <span className='text-primary'> Service/Repair</span>
                <br />
                Near You
            </h2>
            <h2 className='text-xl text-gray-400'>Explore Best Home Service & Repair near you</h2>
            <div className="mt-4 flex flex-col items-center">
                <div className="relative w-full md:w-[350px]">
                    <Input
                        placeholder='Search'
                        value={query}
                        onClick={() => setIsFilterOpen(true)}
                        className="rounded-full cursor-pointer"
                        readOnly
                    />
                </div>
            </div>

            <FilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
        </div>
    );
}

export default Hero;
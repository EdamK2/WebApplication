'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlobalApi from '@/app/_services/GlobalApi';

function FilterPopup({ isOpen, onClose, initialService = 'All' }) {
    const [categories, setCategories] = useState([]);
    const [selectedService, setSelectedService] = useState(initialService);
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

        onClose();
        router.push(`/search/${categoryPath}${queryString ? `?${queryString}` : ''}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[800px] rounded-3xl p-6 h-[85vh] overflow-y-auto 
                scrollbar-hide animate-slideUp">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Service Type */}
                    <div className="filter-section">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Service Type
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedService('All')}
                                className={`px-4 py-2 rounded-full transition-all duration-200
                                    ${selectedService === 'All'
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedService(category.name)}
                                    className={`px-4 py-2 rounded-full transition-all duration-200
                                        ${selectedService === category.name
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City */}
                    <div className="filter-section">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            City
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {cities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => setSelectedCity(city)}
                                    className={`px-4 py-2 rounded-full transition-all duration-200
                                        ${selectedCity === city
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="filter-section">
                        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Minimum Rating
                        </h2>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => setMinRating(rating)}
                                    className={`py-2 rounded-xl transition-all duration-200
                                        ${minRating === rating
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {rating} ★
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Apply Button */}
                <div className="mt-8">
                    <button
                        onClick={handleApplyFilter}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold
                            hover:bg-primary/90 transition-colors duration-200"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FilterPopup;
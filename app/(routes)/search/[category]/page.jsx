"use client"
import TopBusinessInCategory from '@/app/_components/TopBusinessInCategory';
import GlobalApi from '@/app/_services/GlobalApi'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import FilterPopup from '@/app/_components/FilterPopup';
import { Filter } from 'lucide-react';

function BusinessByCategory({ params }) {
    const [businessList, setBusinessList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const searchParams = useSearchParams();
    const category = React.use(params).category;
    const city = searchParams.get('city');
    const rating = searchParams.get('rating');

    useEffect(() => {
        if (category) {
            getFilteredBusinessList();
        }
    }, [category, city, rating]);

    const getFilteredBusinessList = async () => {
        setLoading(true);
        try {
            const result = await GlobalApi.getFilteredBusinesses(category, city, rating);
            setBusinessList(result.businessLists || []);
        } catch (error) {
            console.error('Error fetching filtered results:', error);
            setBusinessList([]);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filter Button and Tags on same line */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-wrap gap-2 items-center">
                    {category !== 'all' && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            Service: {category}
                        </span>
                    )}
                    {city && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            City: {city}
                        </span>
                    )}
                    {rating && (
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            Min Rating: {rating}★
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <Filter size={24} className="text-gray-800" />
                </button>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : businessList.length > 0 ? (
                <TopBusinessInCategory
                    title={category}
                    businessList={businessList}
                />
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-500">No results found matching your criteria.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-4 text-primary hover:underline"
                    >
                        ← Go back
                    </button>
                </div>
            )}

            <FilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialService={category}
            />
        </div>
    );
}

export default BusinessByCategory;

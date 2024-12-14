import { Button } from '@/components/ui/button';
import { Clock, Clock1, Mail, MapPin, Share, User2 } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';  // Add this import
import { getFeedbackCount } from '@/app/_services/GlobalApi';  // Add this import

function Businessinfo({ business }) {
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            if (business?.id) {
                const count = await getFeedbackCount(business.id);
                setTotalReviews(count);
            }
        };
        getCount();
    }, [business?.id]);

    const businessRating = business?.rating || 0;


    return business?.name && (
        <div className='md:flex gap-4 items-center'>
            {business?.images?.length > 0 && business?.images?.[0]?.url ? (
                <Image
                    src={business.images[0].url}
                    alt={business.name}
                    width={150}
                    height={200}
                    className='rounded-full h-[150px] object-cover'
                />
            ) : (

                < Image
                    src="/default-business-image.jpg"
                    alt="Default Image"
                    width={150}
                    height={200}
                    className="rounded-full h-[150px] object-cover"
                />
            )}
            <div className='flex justify-between items-center w-full'>
                <div className='flex flex-col mt-4 md:mt-0 items-baseline gap-3'>
                    <h2 className="text-primary p-1 px-2 text-lg bg-orange-50 rounded-full">
                        {business?.category?.name}
                    </h2>
                    <h2 className='text-[40px] font-bold'>{business.name}</h2>
                    <h2 className='flex gap-2 text-lg text-gray-500'>
                        <MapPin />
                        {business.address}
                    </h2>
                    <h2 className='flex gap-2 text-lg text-gray-500'>
                        <Mail />
                        {business?.email}
                    </h2>
                </div>
                <div className='flex flex-col gap-5 items-end'>
                    <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1 bg-primary/10 px-3 py-2 rounded-full'>
                            <span className='text-xl text-primary'>★</span>
                            <span className='font-semibold text-primary'>{businessRating}</span>
                            <span className='text-sm text-gray-600'>
                                ({totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'})
                            </span>
                        </div>
                    </div>
                    <h2 className='flex gap-2 text-xl text-primary' ><User2 />
                        {business.contactPerson}</h2>
                    <h2 className='flex gap-2 text-xl text-gray-500' ><Clock1 />Available 8:00 AM to 10:00 PM</h2>
                </div>
            </div>
        </div>
    );
}

export default Businessinfo;

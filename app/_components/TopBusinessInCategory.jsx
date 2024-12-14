import React from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import RatingStars from './RatingStars';
import Link from 'next/link';
function TopBusinessInCategory({ businessList, title }) {
    return (
        <div className='mt-5 mx-10'>
            <h2 className='font-bold text-[22px]'>{title}</h2>
            <div className='grid grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 gap-6 mt-5'>
                {businessList.length > 0 ? businessList.map((business, index) => (
                    <Link href={'/details/' + business.id} key={index} className='shadow-md rounded-lg hover:shadow-lg cursor-pointer  hover:shadow-primary hover:scale-105 transition-all ease-in-out'>

                        {business?.images?.[0]?.url ? (
                            <Image src={business.images[0].url}
                                alt={business.name}
                                width={500}
                                height={500}
                                className='h-[250px] md:h-[300px] w-auto
                                object-cover rounded-lg'
                            />
                        ) : (
                            <Image
                                src="/default-business-image.jpg"
                                alt={business.name}
                                width={500}
                                height={500}
                                className='h-[250px] md:h-[300px] w-auto
                                object-cover rounded-lg'
                            />
                        )}
                        <div className='flex flex-col items-baseline p-3 gap-1'>
                            <h2 className='p-1 bg-orange-100 text-primary rounded-full px-2 text-[12px]'>{business.category.name}</h2>
                            <h2 className='font-bold text-lg'>{business.name}</h2>
                            <h2 className='text-primary'>{business.contactPerson}</h2>
                            <h2 className='text-gray-500 text-sm'>{business.address}</h2>
                            <RatingStars rating={business.rating} />
                            <Button className='rounded-lg mt-3'>Book Now</Button>
                        </div>
                    </Link>

                ))
                    :
                    [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                        <div key={index} className='w-full h-[300px] bg-slate-200 rounded-lg animate-pulse'>
                        </div>
                    ))

                }
            </div>
        </div>
    )
}

export default TopBusinessInCategory
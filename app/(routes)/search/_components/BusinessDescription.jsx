import Image from 'next/image'
import React from 'react'

function BusinessDescription({ business }) {
    const feedbackCount = business?.feedback?.length || 0;

    return business?.name && (
        <div>
            <h2 className='font-bold text-[25px]'>Description</h2>
            <p className='mt-4 text-lg text-gray-600'>{business.about}</p>

            <h2 className='font-bold text-[25px] mt-8'>Gallery</h2>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5'>
                {business?.images?.map((item, index) => (
                    <Image
                        src={item?.url || "/default-business-image.jpg"}
                        key={index}
                        alt='image'
                        width={700}
                        height={200}
                        className='rounded-lg hover:scale-105 transition-transform duration-300 shadow-md'
                    />
                ))}
            </div>

            {/* Recent Feedbacks Section */}
            <div className='mt-12'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='font-bold text-[25px]'>What People Say</h2>
                    <div className='flex items-center gap-2'>
                        <span className='bg-primary/10 text-primary px-3 py-1 rounded-full font-medium'>
                            {feedbackCount} {feedbackCount === 1 ? 'Review' : 'Reviews'}
                        </span>
                    </div>
                </div>
                <div className='space-y-6'>
                    {business?.recentFeedback?.map((feedback, index) => (
                        <div key={index}
                            className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 
                                     hover:shadow-md hover:border-primary transition-all duration-300'
                        >
                            <div className='flex items-center justify-between mb-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                                        <span className='text-primary font-semibold text-lg'>
                                            {feedback.client?.fullName?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-gray-800 block'>
                                            {feedback.client?.fullName || 'Anonymous User'}
                                        </span>
                                        {feedback.date && (
                                            <span className='text-sm text-gray-500'>
                                                {new Date(feedback.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className='flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full'>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${i < feedback.pRating
                                                ? 'text-primary'
                                                : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className='ml-1 text-sm font-medium text-gray-600'>
                                        {feedback.pRating}/5
                                    </span>
                                </div>
                            </div>
                            <div className='pl-13'>
                                <p className='text-gray-600 leading-relaxed'>
                                    "{feedback.comment}"
                                </p>
                            </div>
                        </div>
                    ))}
                    {(!business?.recentFeedback || business.recentFeedback.length === 0) && (
                        <div className='bg-gray-50 rounded-xl p-8 text-center border border-gray-100 
                                      hover:border-primary transition-all duration-300'>
                            <div className='text-gray-400 text-5xl mb-3'>★</div>
                            <h3 className='text-gray-700 font-semibold mb-2'>No Reviews Yet</h3>
                            <p className='text-gray-500'>Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BusinessDescription
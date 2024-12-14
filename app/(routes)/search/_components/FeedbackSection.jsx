'use client';
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_services/GlobalApi";

function FeedbackSection({ business, children }) {
    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(''); // Add this line

    // Fetch client ID when component mounts and user is available
    useEffect(() => {
        const fetchClientId = async () => {
            if (user?.emailAddresses?.[0]?.emailAddress) {
                try {
                    const id = await GlobalApi.getClientByEmail(user.emailAddresses[0].emailAddress);
                    setClientId(id);
                } catch (error) {
                    console.error("Error fetching client ID:", error);
                }
            }
        };

        fetchClientId();
    }, [user]);

    const handleSubmit = async () => {
        if (!user) {
            alert('Please login to submit feedback');
            return;
        }

        if (!clientId) {
            alert('Unable to find your client profile');
            return;
        }

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            await GlobalApi.createNewFeedback(
                business.id,
                rating,
                comment,
                clientId
            );
            setSuccessMessage('Thank you! Your feedback has been submitted successfully.');
            setRating(0);
            setComment('');
            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        }
        setLoading(false);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold ">
                        Add Your Feedback
                    </SheetTitle>
                    <SheetDescription className="text-md text-gray-600">
                        Share your experience with <span className="text-primary">{business.contactPerson}</span>
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-8">
                    {successMessage && (
                        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 text-primary rounded-lg shadow-sm flex items-center justify-center space-x-2 animate-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{successMessage}</span>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm text-gray-600 mb-3">
                            Rating
                        </label>
                        <div className="flex gap-3 items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-3xl transition-all duration-200 transform hover:scale-110 ${rating >= star
                                        ? 'text-primary hover:text-primary/90'
                                        : 'text-gray-300 hover:text-primary/50'
                                        }`}
                                >
                                    ★
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                                {rating > 0 ? `${rating} out of 5` : 'Select rating'}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-gray-600 mb-3">
                            Your Comment
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 min-h-[120px] text-gray-700 placeholder-gray-400"
                            placeholder="Share your thoughts and experience..."
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full py-3 text-base font-medium rounded-lg transition-all duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Feedback'
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default FeedbackSection;
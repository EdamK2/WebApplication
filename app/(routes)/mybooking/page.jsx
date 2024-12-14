"use client"
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BookingHistoryList from './_component/BookingHistoryList'
import GlobalApi from '@/app/_services/GlobalApi'
import { useUser } from "@clerk/nextjs"

function MyBooking() {
    const { user } = useUser();
    const [bookingHistory, setBookingHistory] = useState([]);

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté et a un email
        if (user?.emailAddresses[0]?.emailAddress) {
            GetUserBookingHistory()
        }
    }, [user])

    const GetUserBookingHistory = () => {
        GlobalApi.GetUserBookingHistory(user.emailAddresses[0].emailAddress).then(resp => {
            console.log(resp)
            setBookingHistory(resp.bookings)
        })
    }

    const filterData = (type) => {
        const now = new Date(); // Get current date and time

        const result = bookingHistory.filter(item => {
            // Parse the date part
            const datePart = new Date(item.date);

            // Parse the time part
            let [hours, minutes] = [0, 0];
            if (item.time) {
                const timeParts = item.time.match(/(\d+):(\d+)\s*(AM|PM)/i); // Match "12:00 AM" format
                if (timeParts) {
                    hours = parseInt(timeParts[1], 10);
                    minutes = parseInt(timeParts[2], 10);

                    // Convert 12-hour format to 24-hour format
                    if (timeParts[3].toUpperCase() === 'PM' && hours !== 12) hours += 12;
                    if (timeParts[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
                }
            }

            // Combine date and time into a single Date object
            datePart.setHours(hours, minutes, 0, 0);

            // Perform the comparison
            return type === 'booked'
                ? datePart >= now // Future dates and times
                : datePart < now; // Past dates and times
        });

        return result;
    };

    return (
        <div className='my-10 mx-5 ld:mx-36'>
            <h2 className='font-bold text-[20px] my-2'>My Bookings</h2>
            <Tabs defaultValue="booked" className="w-full">
                <TabsList className='w-full justify-start'>
                    <TabsTrigger value="booked">Booked</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="booked">
                    <BookingHistoryList bookingHistory={filterData('booked')} />
                </TabsContent>
                <TabsContent value="completed">
                    <BookingHistoryList bookingHistory={filterData('completed')} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MyBooking
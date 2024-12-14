'use client'
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import GlobalApi from '@/app/_services/GlobalApi';

export default function UserSync() {
    const { user, isLoaded } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && user) {
                try {
                    const userData = {
                        email: user.emailAddresses[0].emailAddress,
                        firstName: user.firstName || 'Anonymous',
                        lastName: user.lastName || 'User'
                    };

                    console.log("Checking user:", userData.email);
                    const result = await GlobalApi.CreateOrUpdateUser(userData);

                    if (result) {
                        console.log("New user created:", result);
                    } else {
                        console.log("User already exists, skipping creation");
                    }
                } catch (error) {
                    console.error('Sync error:', {
                        message: error.message,
                        response: error.response
                    });
                }
            }
        };

        if (user) {
            syncUser();
        }
    }, [isLoaded, user]);

    return null;
}
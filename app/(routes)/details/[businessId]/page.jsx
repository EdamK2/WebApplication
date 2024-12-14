"use client";
import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import GlobalApi from "@/app/_services/GlobalApi";
import { use } from "react"; // Import `use`
import Businessinfo from "../../search/_components/Businessinfo";
import SuggestedBusinessList from "../../search/_components/SuggestedBusinessList";
import BusinessDescription from "../../search/_components/BusinessDescription";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


function BusinessDetail({ params }) {
    const { businessId } = use(params);
    const router = useRouter();
    const { user, isLoaded } = useUser();

    const [business, setBusiness] = useState([])
    useEffect(() => {
        businessId && getBusinessById();
    }, [businessId]);

    useEffect(() => {
        checkUserAuth();
    }, [isLoaded, user]);

    const checkUserAuth = () => {
        if (!isLoaded) {
            return <p>Loading...</p>;
        }
        if (!user) {
            // Rediriger vers la page de connexion Clerk
            router.push('/sign-in');
        }
    };

    const getBusinessById = () => {
        GlobalApi.getBusinessById(businessId).then((resp) => {
            setBusiness(resp.businessList);
        });
    };
    if (!isLoaded || !user) {
        return <p>Loading...</p>;
    }
    return (
        <div className="py-8 md:py-20 px-10 md:px-36">
            <Businessinfo business={business} />
            <div className="grid grid-cols-3 mt-16">
                <div className="col-span-4 md:col-span-2 order-last md:order-first">
                    <BusinessDescription business={business} />
                </div>
                <div className="">
                    <SuggestedBusinessList business={business} />
                </div>
            </div>

        </div>)
}

export default BusinessDetail;

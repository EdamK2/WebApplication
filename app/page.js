"use client"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import CategoryList from "./_components/CategoryList";
import GlobalApi from "./_services/GlobalApi";
import { useEffect, useState } from "react";
import TopBusinessInCategory from "./_components/TopBusinessInCategory";

export default function Home() {
  const [categoryList, setCategoryList] = useState([])
  const [topBusinessInCategory, setTopBusinessInCategory] = useState([])
  useEffect(() => {
    // Fonction principale pour récupérer les données
    const fetchData = async () => {
      try {
        // Récupération des catégories
        const categoryResponse = await GlobalApi.getCategory();
        const categories = categoryResponse.categories;
        setCategoryList(categories);

        // Récupération des top business par catégorie
        if (categories.length > 0) {
          const businessResponse = await GlobalApi.TopBusinessInCategory(categories);
          setTopBusinessInCategory(businessResponse.businessLists);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []); // Exécuté une seule fois au montage du composant

  return (
    <div>
      <Hero />
      <CategoryList categoryList={categoryList} />
      <TopBusinessInCategory
        businessList={topBusinessInCategory}
        title={"Top Rated Per Category"}
      />
    </div>
  );
};
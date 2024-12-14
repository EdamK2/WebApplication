import Image from 'next/image';

function RatingStars({ rating }) {
    const maxStars = 5; // Nombre maximum d'étoiles
    const fullStars = Math.floor(rating); // Nombre d'étoiles pleines
    const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Une étoile à moitié pleine si nécessaire
    const emptyStars = maxStars - fullStars - halfStars; // Étoiles vides pour compléter le total

    // Génération des étoiles
    const stars = [];

    // Ajouter les étoiles pleines
    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Image key={`full-${i}`} src="/icons8-star-50.png" alt="Full Star" width={20} height={20} />
        );
    }

    // Ajouter l'étoile à moitié pleine (si présente)
    if (halfStars === 1) {
        stars.push(
            <Image key="half" src="/icons8-star-half-empty-50.png" alt="Half Star" width={20} height={20} />
        );
    }

    // Ajouter les étoiles vides
    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <Image key={`empty-${i}`} src="/icons8-star-50 (1).png" alt="Empty Star" width={20} height={20} />
        );
    }

    return <div className="flex items-center">{stars}</div>;
}
export default RatingStars
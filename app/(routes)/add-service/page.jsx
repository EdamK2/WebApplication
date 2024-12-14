'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBusinessList } from '../../_services/GlobalApi';
export default function AddService() {
    const cities = [
        'Tunis', 'Sfax', 'Sousse', 'Ettadhamen', 'Kairouan',
        'Gabès', 'Bizerte', 'Ariana', 'La Marsa', 'Gafsa',
        'Monastir', 'Tataouine', 'Hammamet', 'Douz'
    ];

    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        city: '',
        phoneNumber: '',
        address: '',
        about: '',
        email: '',
        category: ''
    });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await createBusinessList(formData);
            if (result?.id) {
                setShowSuccess(true);
                // Attendre 2 secondes avant de rediriger
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }
        } catch (error) {
            console.error('Error creating service:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {showSuccess && (
                <div className="fixed top-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500 ease-in-out transform">
                    Service ajouté avec succès!
                </div>
            )}
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
                    <div>
                        <h1 className="text-3xl font-bold text-center text-primary mb-8">Add a New Service</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <select
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                >
                                    <option value="">Select a city</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                >
                                    <option value="">Select a category</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Plumbing">Plumbing</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Painting">Painting</option>
                                    <option value="Gardening">Gardening</option>
                                    <option value="Transporter">Transporter</option>
                                </select>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all
                                ${loading ? 'opacity-50 cursor-not-allowed' : ''} 
                                transform hover:scale-[1.02] active:scale-[0.98] duration-200`}
                            >
                                {loading ? 'Creating...' : 'Create Service'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
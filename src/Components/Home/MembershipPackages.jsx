import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import useAuth from '../../hooks/useAuth'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from '../../Pages/Payments/PaymentForm'

const stripePromise = loadStripe(import.meta.env.VITE_payment_key)

const getStyles = (badge) => {
    if (badge === 'Silver') {
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', btn: 'bg-gray-700 hover:bg-gray-800' }
    }
    if (badge === 'Gold') {
        return { bg: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-400', btn: 'bg-yellow-500 hover:bg-yellow-600' }
    }
    return { bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700' }
}

const MembershipPackages = () => {
    
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()
    const [selectedPackage, setSelectedPackage] = useState(null)

    const { data: packages = [], isLoading, isError } = useQuery({
        queryKey: ['membership-packages'],
        queryFn: async () => {
            const res = await axiosSecure.get('/membership/packages')
            return res.data
        }
    })

    const { data: userMembership = {} } = useQuery({
        enabled: !!user?.email,
        queryKey: ['user-membership', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/membership/${user.email}`)
            return res.data
        }
    })

    const openModal = (pkg) => setSelectedPackage(pkg)
    const closeModal = () => setSelectedPackage(null)

    if (isLoading) return <div className="text-center py-20"><span className="loading loading-ring loading-sm"></span></div>
    if (isError) return <div className="text-center py-20 text-red-500">Failed to load packages</div>

    return (
        <div id="membership" className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-bold text-center mb-10">Choose Your Membership</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {packages.map((pkg) => {
                    const styles = getStyles(pkg.badge)
                    const isCurrent = userMembership?.membershipId === pkg._id
                    return (
                        <div
                            key={pkg._id}
                            className={`rounded-2xl shadow-md border ${styles.border} ${styles.bg} p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
                        >
                            <div>
                                <h3 className={`text-2xl font-semibold mb-2 ${styles.text}`}>{pkg.badge} Package</h3>
                                <p className="text-3xl font-bold mb-4">${pkg.price}/month</p>
                                <ul className="mb-6 list-disc list-inside text-sm space-y-1 text-gray-700">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={() => openModal(pkg)}
                                disabled={isCurrent}
                                className={`mt-auto w-full py-2 rounded-xl font-semibold text-white cursor-pointer transition duration-300 ${isCurrent ? 'bg-gray-300 cursor-not-allowed' : styles.btn}`}
                            >
                                {isCurrent ? 'Current Plan' : `Choose`}
                            </button>
                        </div>
                    )
                })}
            </div>

            {selectedPackage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                        <button onClick={closeModal} className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl">&times;</button>
                        <h3 className="text-xl font-semibold mb-4 text-center">Pay for {selectedPackage.badge} Plan</h3>
                        <Elements stripe={stripePromise}>
                            <PaymentForm id={selectedPackage._id} price={selectedPackage.price} badge={selectedPackage.badge} closeModal={closeModal} />
                        </Elements>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MembershipPackages

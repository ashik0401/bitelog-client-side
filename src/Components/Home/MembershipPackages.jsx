import React from 'react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import useAxiosSecure from '../../hooks/useAxiosSecure'


const getStyles = (name) => {
  if (name === 'Silver') {
    return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', btn: 'bg-gray-700 hover:bg-gray-800' }
  }
  if (name === 'Gold') {
    return { bg: 'bg-yellow-100', text: 'text-yellow-900', border: 'border-yellow-400', btn: 'bg-yellow-500 hover:bg-yellow-600' }
  }
  return { bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-400', btn: 'bg-indigo-600 hover:bg-indigo-700' }
}

const MembershipPackages = () => {
  const navigate = useNavigate()
  const axiosSecure = useAxiosSecure()

  const { data: packages = [], isLoading, isError } = useQuery({
    queryKey: ['membership-packages'],
    queryFn: async () => {
      const res = await axiosSecure.get('/membership/packages')
      return res.data
    }
  })

  const handleCheckout = (packageName) => {
    navigate(`/checkout/${packageName.toLowerCase()}`)
  }

  if (isLoading) return <div className="text-center py-20">Loading packages...</div>
  if (isError) return <div className="text-center py-20 text-red-500">Failed to load packages</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-center mb-10">Choose Your Membership</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg) => {
          const styles = getStyles(pkg.name)
          return (
            <div
              key={pkg.name}
              className={`rounded-2xl shadow-md border ${styles.border} ${styles.bg} p-6 flex flex-col justify-between hover:scale-105 transition-transform duration-300`}
            >
              <div>
                <h3 className={`text-2xl font-semibold mb-2 ${styles.text}`}>{pkg.name} Package</h3>
                <p className="text-3xl font-bold mb-4">${pkg.price}/month</p>
                <ul className="mb-6 list-disc list-inside text-sm space-y-1 text-gray-700">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleCheckout(pkg.name)}
                className={`mt-auto w-full py-2 rounded-xl font-semibold text-white ${styles.btn} transition duration-300`}
              >
                Choose {pkg.name}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MembershipPackages

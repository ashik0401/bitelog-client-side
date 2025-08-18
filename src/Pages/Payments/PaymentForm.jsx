import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import React, { useState } from 'react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import Swal from 'sweetalert2'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router'

const PaymentForm = ({ id, price, badge, closeModal }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState('')
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()
    const navigate = useNavigate()

    const amount = price
    const amountInCents = amount * 100

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        const card = elements.getElement(CardElement)
        if (!card) return

        const { error: methodError} = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (methodError) {
            setError(methodError.message)
            return
        }

        setError('')
        const res = await axiosSecure.post('/create-payment-intent', { amountInCents })
        const clientSecret = res.data.clientSecret

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: user.displayName,
                    email: user.email
                },
            },
        })

        if (result.error) {
            setError(result.error.message)
        } else if (result.paymentIntent.status === 'succeeded') {
            const transactionId = result.paymentIntent.id
            const paymentData = {
                email: user.email,
                amount,
                transactionId,
                paymentMethod: result.paymentIntent.payment_method_types,
                membershipId: id,
                membershipBadge: badge
            }

            const paymentRes = await axiosSecure.post('/payments', paymentData)
            if (paymentRes.data.insertedId) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful!',
                    html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                    confirmButtonText: 'Go to Dashboard',
                })

                closeModal()
                navigate('/dashboard')
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <CardElement />
            <button
                type="submit"
                disabled={!stripe}
                className="text-black py-2 px-4 rounded disabled:opacity-50 cursor-pointer w-full bg-orange-500"
            >
                Pay ${amount}
            </button>
            <p className="text-red-500">{error}</p>
        </form>
    )
}

export default PaymentForm

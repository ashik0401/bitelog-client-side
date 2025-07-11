import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';


const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: membershipInfo = {}, isPending } = useQuery({
        queryKey: ['membership', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/membership/packages/${id}`);
            return res.data;
        }
    });

    if (isPending) {
        return <span className="loading loading-ring loading-md"></span>;
    }

    const amount = membershipInfo.price;
    const amountInCents = amount * 100;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        });

        if (methodError) {
            setError(methodError.message);
            return;
        }
        else {
            setError('')
            console.log('PaymentMethod', paymentMethod);

            const res = await axiosSecure.post('/create-payment-intent', { amountInCents });


            const clientSecret = res.data.clientSecret;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else {
                setError('');
                if (result.paymentIntent.status === 'succeeded') {
                    const transactionId = result.paymentIntent.id;
                    const paymentData = {
                        email: user.email,
                        amount,
                        transactionId,
                        paymentMethod: result.paymentIntent.payment_method_types,
                        membershipId: id,
                        membershipBadge: membershipInfo.badge



                    };
                    console.log(result, 'payment');


                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    if (paymentRes.data.insertedId) {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `<strong>Transaction ID:</strong> <code>${transactionId}</code>`,
                            confirmButtonText: 'Go to Dashboard',
                        });
                        console.log('payments successfull');

                    }
                }
            }

        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="p-4 border rounded max-w-md mx-auto space-y-4">
                <CardElement />
                <button
                    type="submit"
                    disabled={!stripe}
                    className="text-white py-2 px-4 rounded disabled:opacity-50 cursor-pointer w-full bg-primary"
                >
                    Pay ${amount}
                </button>
                <p className="text-red-500">{error}</p>
            </form>
        </div>
    );
};

export default PaymentForm;

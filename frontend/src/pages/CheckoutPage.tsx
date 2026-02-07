import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { orderApi } from '../api/orders';
import { formatPrice } from '../lib/utils';
import { Input } from '../components/ui/Input';

const shippingSchema = z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
    const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
    const [shippingAddress, setShippingAddress] = useState<ShippingFormData | null>(null);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingFormData>({
        resolver: zodResolver(shippingSchema),
    });

    const createOrderMutation = useMutation({
        mutationFn: orderApi.createOrder,
        onSuccess: (order) => {
            clearCart();
            navigate(`/order/${order._id}`);
        },
        onError: (err: unknown) => {
            setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Order creation failed');
        },
    });

    const onShippingSubmit = (data: ShippingFormData) => {
        setShippingAddress(data);
        setStep('payment');
    };

    const handlePlaceOrder = () => {
        if (!shippingAddress) return;

        createOrderMutation.mutate({
            orderItems: cartItems.map((item) => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item.product,
            })),
            shippingAddress,
            paymentMethod: 'Stripe',
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
    };

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#000000] mb-12 uppercase tracking-tighter">SECURE SECURE</h1>

            {/* Progress Steps */}
            <div className="flex items-center mb-16 max-w-2xl">
                <div className={`flex items-center ${step === 'shipping' ? 'text-[#0066ff]' : 'text-[#000000]'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step === 'shipping' ? 'bg-[#000000]' : 'bg-[#000000]'} text-white shadow-xl`}>
                        <MapPin className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <span className="ml-4 font-black uppercase tracking-[0.2em] text-xs">SHIPPING</span>
                </div>
                <div className="flex-1 h-2 bg-[#f4f4f5] mx-6 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${step === 'payment' ? 'bg-[#0066ff] w-full' : 'bg-[#000000] w-1/2'}`} />
                </div>
                <div className={`flex items-center ${step === 'payment' ? 'text-[#0066ff]' : 'text-[#a1a1aa]'}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step === 'payment' ? 'bg-[#0066ff]' : 'bg-[#f4f4f5]'} ${step === 'payment' ? 'text-white shadow-xl' : 'text-[#a1a1aa]'}`}>
                        <CreditCard className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <span className="ml-4 font-black uppercase tracking-[0.2em] text-xs">PAYMENT</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {step === 'shipping' && (
                        <div className="bg-[#ffffff] rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-10">
                            <h2 className="text-3xl font-display font-black text-[#000000] mb-10 uppercase tracking-tighter">WHERE TO?</h2>
                            <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-8">
                                <Input
                                    id="address"
                                    label="STREET ADDRESS"
                                    placeholder="Enter your street"
                                    error={errors.address?.message}
                                    {...register('address')}
                                    className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                                />
                                <div className="grid grid-cols-2 gap-8">
                                    <Input
                                        id="city"
                                        label="CITY"
                                        placeholder="Enter your city"
                                        error={errors.city?.message}
                                        {...register('city')}
                                        className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                                    />
                                    <Input
                                        id="postalCode"
                                        label="POSTAL CODE"
                                        placeholder="Enter zip code"
                                        error={errors.postalCode?.message}
                                        {...register('postalCode')}
                                        className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                                    />
                                </div>
                                <Input
                                    id="country"
                                    label="COUNTRY"
                                    placeholder="Enter your country"
                                    error={errors.country?.message}
                                    {...register('country')}
                                    className="border-4 border-[#000000] rounded-2xl p-4 font-black"
                                />
                                <button type="submit" className="w-full bg-[#000000] hover:bg-[#1a1a1a] text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl active:scale-95 mt-6 border-2 border-black">
                                    CONTINUE TO SECURE PAYMENT
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'payment' && shippingAddress && (
                        <div className="bg-[#ffffff] rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-10">
                            <h2 className="text-3xl font-display font-black text-[#000000] mb-10 uppercase tracking-tighter">PAYMENT DETAILS</h2>

                            <div className="mb-10 p-8 bg-[#f4f4f5] rounded-3xl border-2 border-[#000000]/10">
                                <p className="text-xs font-black text-[#71717a] uppercase tracking-widest mb-3">SHIPPING DESTINATION</p>
                                <p className="text-lg font-black text-[#000000] uppercase tracking-tighter">
                                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                                </p>
                                <button onClick={() => setStep('shipping')} className="text-[#0066ff] font-black uppercase text-[10px] tracking-widest mt-4 hover:underline">
                                    CHANGE ADDRESS
                                </button>
                            </div>

                            <div className="border-4 border-dashed border-[#000000]/20 rounded-3xl p-12 mb-10 text-center text-[#52525b] bg-[#fdfdfd]">
                                <CreditCard className="w-16 h-16 mx-auto mb-6 text-[#000000]" strokeWidth={2.5} />
                                <p className="text-xl font-black uppercase tracking-widest text-[#000000] mb-2">STRIPE ENCRYPTED</p>
                                <p className="text-sm font-bold opacity-60">CONFIGURE API_KEY FOR PRODUCTION PAYMENTS</p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full bg-[#0066ff] hover:bg-[#0055ee] text-white py-6 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-2xl shadow-[#0066ff]/20 active:scale-95"
                            >
                                AUTHORIZE & PLACE ORDER - {formatPrice(totalPrice)}
                            </button>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-[#ffffff] rounded-[2.5rem] shadow-2xl border-4 border-[#000000] p-8 sticky top-24">
                        <h2 className="text-2xl font-display font-black text-[#000000] mb-8 uppercase tracking-tighter">SUMMARY</h2>

                        <div className="space-y-6 mb-10 overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                            {cartItems.map((item) => (
                                <div key={item.product} className="flex gap-4 items-center">
                                    <div className="relative">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border-2 border-black" />
                                        <span className="absolute -top-3 -right-3 w-7 h-7 bg-[#000000] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                                            {item.qty}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-[#000000] truncate uppercase tracking-tighter">{item.name}</p>
                                        <p className="text-lg font-display font-black text-[#000000] tracking-tighter">{formatPrice(item.price)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-4 border-[#000000] pt-8 space-y-4">
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#71717a]">
                                <span>SUBTOTAL</span>
                                <span className="text-[#000000]">{formatPrice(itemsPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#71717a]">
                                <span>SHIPPING</span>
                                <span className="text-[#0066ff]">{shippingPrice === 0 ? 'FREE' : formatPrice(shippingPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-[#71717a]">
                                <span>TAX</span>
                                <span className="text-[#000000]">{formatPrice(taxPrice)}</span>
                            </div>
                            <div className="flex justify-between items-center text-2xl font-display font-black text-[#000000] pt-6 border-t-2 border-black/5 tracking-tighter">
                                <span>TOTAL</span>
                                <span>{formatPrice(totalPrice)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

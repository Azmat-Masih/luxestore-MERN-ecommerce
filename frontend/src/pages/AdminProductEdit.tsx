import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Save } from 'lucide-react';
import { adminApi } from '../api/admin';
import { productApi } from '../api/products';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    category: z.string().min(2, 'Category is required'),
    brand: z.string().min(2, 'Brand is required'),
    countInStock: z.coerce.number().min(0, 'Stock must be positive'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    image: z.string().url('Invalid image URL'),
});

type ProductFormData = z.infer<typeof productSchema>;

export const AdminProductEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = id && id !== 'new';

    const { data: product, isLoading: productLoading } = useQuery({
        queryKey: ['adminProduct', id],
        queryFn: () => productApi.getProductById(id!),
        enabled: !!isEdit,
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    });

    useEffect(() => {
        if (product) {
            setValue('name', product.name);
            setValue('price', product.price);
            setValue('category', product.category);
            setValue('brand', product.brand);
            setValue('countInStock', product.countInStock);
            setValue('description', product.description);
            setValue('image', product.image);
        }
    }, [product, setValue]);

    const mutation = useMutation({
        mutationFn: (data: ProductFormData) =>
            isEdit ? adminApi.updateProduct(id!, data) : adminApi.createProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
            navigate('/admin/products');
            alert(`Product ${isEdit ? 'updated' : 'created'} successfully`);
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Action failed');
        }
    });

    const onSubmit = (data: ProductFormData) => {
        mutation.mutate(data);
    };

    if (isEdit && productLoading) return <div className="p-8">Loading product...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Link to="/admin/products" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
                <ChevronLeft size={20} /> Back to Products
            </Link>

            <h1 className="text-3xl font-bold mb-8">{isEdit ? 'Edit Product' : 'Create Product'}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-2xl border shadow-sm">
                <Input
                    id="name"
                    label="Product Name"
                    error={errors.name?.message}
                    {...register('name')}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="price"
                        label="Price"
                        type="number"
                        step="0.01"
                        error={errors.price?.message}
                        {...register('price')}
                    />
                    <Input
                        id="countInStock"
                        label="In Stock"
                        type="number"
                        error={errors.countInStock?.message}
                        {...register('countInStock')}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        id="category"
                        label="Category"
                        error={errors.category?.message}
                        {...register('category')}
                    />
                    <Input
                        id="brand"
                        label="Brand"
                        error={errors.brand?.message}
                        {...register('brand')}
                    />
                </div>

                <Input
                    id="image"
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    error={errors.image?.message}
                    {...register('image')}
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[150px]"
                        {...register('description')}
                    />
                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2"
                    isLoading={mutation.isPending}
                >
                    <Save size={20} /> {isEdit ? 'Update Product' : 'Create Product'}
                </Button>
            </form>
        </div>
    );
};

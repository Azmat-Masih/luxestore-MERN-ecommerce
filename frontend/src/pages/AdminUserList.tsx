import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ShieldCheck, User as UserIcon } from 'lucide-react';
import { adminApi } from '../api/admin';
import { Button } from '../components/ui/Button';

export const AdminUserList: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: users, isLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: adminApi.getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: adminApi.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            alert('User deleted successfully');
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Delete failed');
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Users</h1>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">NAME</th>
                            <th className="p-4 font-semibold text-gray-600">EMAIL</th>
                            <th className="p-4 font-semibold text-gray-600">ADMIN</th>
                            <th className="p-4 font-semibold text-gray-600">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users?.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-500">{user._id.slice(-6)}</td>
                                <td className="p-4 font-medium">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    {user.isAdmin ? (
                                        <ShieldCheck className="text-green-600" size={20} />
                                    ) : (
                                        <UserIcon className="text-gray-400" size={20} />
                                    )}
                                </td>
                                <td className="p-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(user._id)}
                                        disabled={user.isAdmin}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

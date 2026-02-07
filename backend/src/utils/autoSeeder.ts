import User from '../models/userModel';
import Product from '../models/productModel';
import bcrypt from 'bcryptjs';
import { users, products } from '../mockData';

export const autoSeed = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) return;

        console.log('Database empty. Auto-seeding mock data...');

        // Hash passwords for users
        const createdUsers = await Promise.all(
            users.map(async (user) => {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(user.password, salt);
                return { ...user, password: hashedPassword };
            })
        );

        const savedUsers = await User.insertMany(createdUsers);
        const adminUser = savedUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('✅ Auto-seeding complete.');
    } catch (error) {
        console.error(`❌ Auto-seeding failed: ${(error as Error).message}`);
    }
};

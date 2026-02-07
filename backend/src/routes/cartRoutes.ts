import express from 'express';
import {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
    syncCart,
} from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route('/sync').put(protect, syncCart);
router.route('/:productId').delete(protect, removeFromCart);

export default router;

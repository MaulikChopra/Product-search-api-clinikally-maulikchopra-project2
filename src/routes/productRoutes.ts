import { Router } from 'express';
import { searchProducts } from '../controllers/productController';
import { validateSearchParams } from '../middleware/validateSearch';

const router = Router();

/**
 * @route GET /products/search
 * @desc Search for products by title or brand
 * @query q - Search query (required, min length 2)
 * @query limit - Number of products to return (default: 10)
 * @query skip - Number of products to skip (default: 0)
 */
router.get('/search', validateSearchParams, searchProducts);

export default router;
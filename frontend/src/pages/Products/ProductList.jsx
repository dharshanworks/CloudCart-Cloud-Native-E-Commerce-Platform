import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../services/productService';
import { ProductGrid } from '../../components/product/ProductGrid';

export const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const page = searchParams.get('page') || 1;
        const category = searchParams.get('category') || '';
        const search = searchParams.get('search') || '';

        const response = await productService.getAll(page, category, search);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  return <ProductGrid products={products} loading={loading} />;
};



import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { ProductCard } from '../../components/product/ProductCard';
import { SectionTitle } from '../../components/ui/SectionTitle';

export const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getAll(1, '', '', 6);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <SectionTitle title="Featured Products" subtitle="Check out our bestsellers" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};



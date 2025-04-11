import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Homepage = async () => {
  // Fetch the latest products with server-side limit
  const latestProducts = await getLatestProducts(); // Add limit parameter

  return (
    <section className="container mx-auto px-4 py-8">
      <ProductList
        data ={latestProducts}
        title="Latest Products"
        />

      <div className="mt-8 text-center">
        <Button asChild variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </section>
  );
};

export default Homepage;

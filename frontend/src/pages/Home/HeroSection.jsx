import { SectionTitle } from '../../components/ui/SectionTitle';

export const HeroSection = () => {
  return (
    <div className="mb-12 rounded-2xl bg-gradient-to-r from-gray-900 via-stone-800 to-gray-900 p-12 text-white shadow-xl">
      <div className="max-w-2xl">
        <h1 className="mb-4 text-5xl font-bold">Welcome to CloudCart</h1>
        <p className="mb-6 text-xl text-white/90">
          Discover amazing products with unbeatable prices, fast shipping, and excellent customer service.
        </p>
        <a href="/products" className="btn btn-neutral text-white">
          Shop Now
        </a>
      </div>
    </div>
  );
};



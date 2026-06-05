import { SectionTitle } from '../../components/ui/SectionTitle';

export const Categories = () => {
  const categories = [
    { name: 'Electronics', icon: '📱', color: 'bg-base-200' },
    { name: 'Clothing', icon: '👕', color: 'bg-base-200' },
    { name: 'Books', icon: '📚', color: 'bg-base-200' },
    { name: 'Home', icon: '🏠', color: 'bg-base-200' },
    { name: 'Sports', icon: '⚽', color: 'bg-base-200' },
    { name: 'Toys', icon: '🎮', color: 'bg-base-200' },
  ];

  return (
    <div>
      <SectionTitle title="Shop by Category" subtitle="Explore our wide range of products" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.name}
            href={`/products?category=${cat.name}`}
            className={`card border border-base-300 ${cat.color} shadow transition-shadow hover:shadow-md`}
          >
            <div className="card-body items-center justify-center">
              <div className="text-4xl mb-2">{cat.icon}</div>
              <h3 className="font-bold text-center">{cat.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};



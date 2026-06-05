import { Link } from 'react-router-dom';

export const Home = () => (
  <div className="space-y-12">
    {/* Local keyframes so we don't depend on tailwind.config changes.
        Provides a gentle fade-up on load and a slow background pan for the hero. */}
    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes heroPan {
        0%, 100% { background-position: 0% 50%; }
        50%      { background-position: 100% 50%; }
      }
      .v0-fade-up { animation: fadeUp 0.6s ease-out both; }
    `}</style>

    {/* Hero Section
        - Animated, larger gradient (bg-[length] + heroPan) adds subtle motion.
        - Gradient clipped text on the heading for a premium feel.
        - Ring + scale on the CTA button for a tactile hover state. */}
    <div
      className="hero v0-fade-up overflow-hidden rounded-2xl border border-base-300 py-24 text-white shadow-2xl
                 bg-linear-to-r from-gray-900 via-stone-800 to-gray-900 bg-size-[200%_200%]"
      style={{ animation: 'heroPan 12s ease-in-out infinite' }}
    >
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="mb-6 bg-linear-to-r from-white via-stone-200 to-white bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl">
            Welcome to CloudCart
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-stone-300">
            Discover amazing products at unbeatable prices. Shop with confidence.
          </p>
          <Link
            to="/products"
            className="btn btn-neutral btn-lg gap-2 shadow-lg transition-all duration-300
                       hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-white/30"
          >
            Shop Now
            {/* Arrow nudges right on hover via group-like sibling transition */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>

    {/* Features Section
        - `group` enables coordinated hover effects (icon scale + accent border).
        - Lift + shadow on hover; staggered fade-up via inline animation-delay. */}
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {[
        { icon: '🚚', title: 'Fast Shipping', text: 'Get your orders delivered quickly and safely.' },
        { icon: '💯', title: 'Quality Guarantee', text: 'All products meet our strict quality standards.' },
        { icon: '💳', title: 'Secure Payment', text: 'Your payment information is safe and secure.' },
      ].map((feature, i) => (
        <div
          key={feature.title}
          className="card group v0-fade-up border border-base-300 bg-base-100 shadow-md transition-all duration-300
                     hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <div className="card-body items-center text-center">
            {/* Icon sits in a soft tinted badge that pops on hover */}
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-4xl
                            transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
              {feature.icon}
            </div>
            <h2 className="card-title justify-center">{feature.title}</h2>
            <p className="text-base-content/70">{feature.text}</p>
          </div>
        </div>
      ))}
    </div>

    {/* CTA Section
        - Brand-tinted gradient background + subtle ring makes it stand out.
        - Larger, animated button reinforces the primary conversion action. */}
    <div className="v0-fade-up rounded-2xl border border-primary/20 bg-linear-to-br from-base-200 to-base-300/60 p-10 text-center shadow-sm ring-1 ring-primary/10">
      <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Shopping?</h2>
      <p className="mb-8 text-lg text-base-content/70">
        Browse our extensive collection of products.
      </p>
      <Link
        to="/products"
        className="btn btn-primary btn-lg gap-2 shadow-lg transition-all duration-300
                   hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl"
      >
        View All Products
      </Link>
    </div>
  </div>
);
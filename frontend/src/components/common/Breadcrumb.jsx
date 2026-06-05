import { Link, useLocation } from 'react-router-dom';

/**
 * Breadcrumb Navigation Component
 * Shows current navigation path for better UX
 */
export const Breadcrumb = ({ customLabel = null }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Skip breadcrumb for root path
  if (pathnames.length === 0) {
    return null;
  }

  // Generate breadcrumb items
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label =
        customLabel ||
        value
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase())
          .trim();

      return {
        label,
        path
      };
    })
  ];

  return (
    <nav className="bg-base-100 px-4 py-3 rounded-lg shadow-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <svg
                className="mx-2 h-4 w-4 text-base-content/40"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-semibold text-base-content/80">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="text-primary hover:underline transition"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

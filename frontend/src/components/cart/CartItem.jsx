import { Link } from 'react-router-dom';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item?.product?._id) {
    return null;
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > item.product?.stock) return;
    onUpdateQuantity?.(item.product._id, newQuantity);
  };

  const totalPrice = (item.price || item.product?.price || 0) * item.quantity;

  return (
    <div className="card border border-base-300 bg-base-100 shadow transition hover:shadow-lg">
      <div className="card-body p-4">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <Link to={`/products/${item.product._id}`}>
              <img
                src={
                  item.product?.images?.[0] ||
                  item.product?.image ||
                  'https://via.placeholder.com/120x120?text=Product'
                }
                alt={item.product?.name}
                className="h-24 w-full cursor-pointer rounded object-cover transition hover:opacity-80"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/120x120?text=Product';
                }}
              />
            </Link>
          </div>

          <div className="sm:col-span-1">
            <Link to={`/products/${item.product._id}`} className="transition hover:text-primary">
              <h3 className="line-clamp-2 text-base font-bold hover:underline">
                {item.product?.name}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-base-content/70">
              ${(item.price || item.product?.price || 0).toFixed(2)} each
            </p>
            {item.product?.category && (
              <p className="mt-1 text-xs text-base-content/60">{item.product.category}</p>
            )}
          </div>

          <div className="sm:col-span-1">
            <label className="mb-2 block text-sm font-semibold">Quantity</label>
            <div className="flex w-fit items-center rounded border border-base-300">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-base-200"
              >
                −
              </button>
              <span className="min-w-12 px-3 py-1 text-center font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= (item.product?.stock || 999)}
                className="px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-base-200"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between gap-3 sm:col-span-1">
            <div className="text-right">
              <p className="text-sm text-base-content/70">Total</p>
              <p className="text-xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onRemove?.(item.product._id)}
              className="btn btn-sm btn-ghost btn-error"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

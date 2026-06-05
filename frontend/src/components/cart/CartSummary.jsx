import { formatCurrency } from '../../utils/formatCurrency';
import { TAX_RATE, SHIPPING_COST } from '../../utils/constants';

export const CartSummary = ({ subtotal, onCheckout, isLoading }) => {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + SHIPPING_COST;

  return (
    <div className="card sticky top-20 h-fit border border-base-300 bg-base-100 p-6 shadow">
      <h3 className="font-bold text-lg mb-4">Order Summary</h3>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{formatCurrency(SHIPPING_COST)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (8%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="divider my-2"></div>
        <div className="flex justify-between font-bold text-lg text-primary">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      <button
        className="btn btn-primary w-full"
        onClick={onCheckout}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>
    </div>
  );
};

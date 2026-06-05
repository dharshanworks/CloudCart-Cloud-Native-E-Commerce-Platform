export const EmptyState = ({ title = 'No items found', message = '', icon = '📭', action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="mb-6 text-base-content/60">{message}</p>
      {action}
    </div>
  );
};

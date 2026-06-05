export const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-base-100 shadow-lg transform transition-transform duration-300 z-50 md:static md:w-auto md:shadow-none md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {children}
      </div>
    </>
  );
};

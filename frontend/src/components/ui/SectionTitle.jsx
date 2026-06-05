export const SectionTitle = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="text-4xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-lg text-base-content/70">{subtitle}</p>}
    </div>
  );
};

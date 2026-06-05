export const Loader = ({ fullScreen = false }) => {
  const spinner = <span className="loading loading-spinner loading-lg text-primary"></span>;

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

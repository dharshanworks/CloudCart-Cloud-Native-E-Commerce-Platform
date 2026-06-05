import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const Login = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { login, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const newErrors = {};
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password?.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-gray-900 via-stone-800 to-gray-900 bg-size-[200%_200%] px-4 py-8"
         style={{ animation: 'heroPan 14s ease-in-out infinite' }}>
      {/* Scoped keyframes: gentle background pan + a soft fade/scale entrance for the card */}
      <style>{`
        @keyframes heroPan {
          0%, 100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .v0-card-in { animation: cardIn 0.6s ease-out both; }
      `}</style>

      <div className="v0-card-in w-full max-w-md">
        {/* Brand header — badge gets a tactile hover lift */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-block rounded-2xl bg-white/15 p-3 shadow-lg ring-1 ring-white/20 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="mb-2 bg-linear-to-r from-white via-stone-200 to-white bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            CloudCart
          </h1>
          <p className="text-white/80">Welcome back to your shopping</p>
        </div>

        {/* Card with subtle border glow and elevated shadow */}
        <div className="card border border-white/10 bg-base-100 shadow-2xl transition-shadow duration-300 hover:shadow-primary/10">
          <div className="card-body space-y-6">
            <h2 className="card-title mb-2 justify-center text-2xl">Login to Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={`input input-bordered w-full transition-all duration-200 focus:scale-[1.01] ${
                    errors.email ? 'input-error focus:input-error' : 'focus:input-primary'
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email}</span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-10 transition-all duration-200 focus:scale-[1.01] ${
                      errors.password ? 'input-error focus:input-error' : 'focus:input-primary'
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-base-content/70 transition-transform duration-200 hover:scale-110 hover:text-base-content/90"
                    tabIndex="-1"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password}</span>
                  </label>
                )}
              </div>

              {/* Remember Me */}
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                  <span className="label-text text-sm">Remember me</span>
                </label>
              </div>

              {/* Submit Button — lift + scale + ring on hover */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg mt-6 w-full gap-2 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-primary/30 disabled:hover:translate-y-0 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Logging in...
                  </>
                ) : (
                  '→ Login'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-base-content/70">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary font-semibold transition-colors hover:text-primary/80">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
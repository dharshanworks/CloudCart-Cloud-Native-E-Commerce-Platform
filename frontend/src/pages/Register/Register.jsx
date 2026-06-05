import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    return {
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    };
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password?.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

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
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    }
  };

  const passwordStrength = validatePassword(formData.password);
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-gray-900 via-stone-800 to-gray-900 bg-size-[200%_200%] px-4 py-8"
         style={{ animation: 'heroPan 14s ease-in-out infinite' }}>
      {/* Scoped keyframes: gentle background pan + soft fade/scale entrance for the card */}
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
          <p className="text-white/80">Join our shopping community</p>
        </div>

        {/* Card with subtle border glow and elevated shadow */}
        <div className="card border border-white/10 bg-base-100 shadow-2xl transition-shadow duration-300 hover:shadow-primary/10">
          <div className="card-body space-y-6">
            <h2 className="card-title mb-2 justify-center text-2xl">Create Your Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className={`input input-bordered w-full transition-all duration-200 focus:scale-[1.01] ${
                    errors.name ? 'input-error focus:input-error' : 'focus:input-primary'
                  }`}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name}</span>
                  </label>
                )}
              </div>

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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 rounded-lg bg-base-200 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-semibold">Password Strength:</span>
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strengthScore ? 'bg-success' : 'bg-base-300'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <ul className="space-y-1 text-xs">
                      <li className={`transition-colors duration-200 ${passwordStrength.hasLength ? 'text-success' : 'text-base-content/40'}`}>
                        ✓ At least 8 characters
                      </li>
                      <li className={`transition-colors duration-200 ${passwordStrength.hasUpperCase ? 'text-success' : 'text-base-content/40'}`}>
                        ✓ Uppercase letter
                      </li>
                      <li className={`transition-colors duration-200 ${passwordStrength.hasLowerCase ? 'text-success' : 'text-base-content/40'}`}>
                        ✓ Lowercase letter
                      </li>
                      <li className={`transition-colors duration-200 ${passwordStrength.hasNumber ? 'text-success' : 'text-base-content/40'}`}>
                        ✓ Number
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-10 transition-all duration-200 focus:scale-[1.01] ${
                      errors.confirmPassword ? 'input-error focus:input-error' : 'focus:input-primary'
                    }`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-base-content/70 transition-transform duration-200 hover:scale-110 hover:text-base-content/90"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                  </label>
                )}
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
                    Creating Account...
                  </>
                ) : (
                  '→ Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="divider my-2">OR</div>

            {/* Login Link */}
            <p className="text-center text-sm text-base-content/70">
              Already have an account?{' '}
              <Link to="/login" className="link link-primary font-semibold transition-colors hover:text-primary/80">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
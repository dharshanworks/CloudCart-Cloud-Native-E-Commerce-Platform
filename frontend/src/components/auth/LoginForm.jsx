import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { CustomInput } from '../ui/CustomInput';
import { CustomButton } from '../ui/CustomButton';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.email || !formData.password) {
      setErrors({ general: 'Please fill all fields' });
      return;
    }

    try {
      await login(formData.email, formData.password);
      
      // Check for stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center mb-6">Login</h2>

          {errors.general && (
            <div className="alert alert-error mb-4">
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              error={errors.email}
            />

            <CustomInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />

            <CustomButton
              type="submit"
              isLoading={loading}
              variant="btn-primary"
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </CustomButton>
          </form>

          <div className="text-center text-sm mt-4">
            Don't have account?{' '}
            <Link to="/register" className="link link-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

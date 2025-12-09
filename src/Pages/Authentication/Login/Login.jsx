import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import SocialLogin from '../SocialLogin/SocialLogin';
import useAuth from '../../../hooks/useAuth';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

 const onSubmit = async (data) => {
  setLoginError('');
  clearErrors('password');
  try {
    const result = await signIn(data.email, data.password);
    const user = result.user;

    const token = await user.getIdToken();
    localStorage.setItem('access-token', token);

    navigate(from, { replace: true });
  } catch (err) {
    setLoginError('Invalid email or password',err);
  }
};

  return (
    <div className="h-[87vh] flex justify-center items-center px-4">
      <div className="card  text-black w-full max-w-sm shadow-2xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center mb-4">Welcome Back</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input input-bordered w-full border border-gray-200 bg-white "
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="input input-bordered w-full pr-10  border-gray-200 bg-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>
            <div className="">
              <a className="link link-hover text-sm">Forgot password?</a>
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="btn w-full   bg-[#066303] border-none hover:bg-[#043f02]">Login</button>
          </form>
          <p className="text-center mt-4 text-sm">
            New here?
            <Link to="/register" state={{ from }} className="text-blue-600 font-semibold ml-1 ">
              Create an account
            </Link>
          </p>
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;

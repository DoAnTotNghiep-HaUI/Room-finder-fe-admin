import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ForgotPassword from "./forgot-password";
import { CiLock, CiMail } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { BiCheckCircle } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/redux/auth/action";
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  onLogin?: (data: LoginFormData) => void;
  onSignUp?: () => void;
}

export default function AuthLogin({ onLogin, onSignUp }: LoginProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  console.log("formDataa", formData);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // gọi redux login thunk
      await dispatch(
        login({ email: formData.email, password: formData.password })
      ).unwrap();

      setLoginSuccess(true);

      // callback nếu có
      onLogin?.(formData);

      // chuyển hướng sang dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ email: "Email hoặc mật khẩu không chính xác" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword
        onBack={() => setShowForgotPassword(false)}
        onSuccess={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-[#1E88E5] rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CiLock className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {loginSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <BiCheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                Đăng nhập thành công!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2 text-left"
            >
              Email
            </label>
            <div className="relative">
              <CiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-[#1E88E5] focus:border-[#1E88E5]"
                }`}
                placeholder="Nhập email của bạn"
                disabled={isLoading}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-600 text-sm"
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2 text-left"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <CiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-[#1E88E5] focus:border-[#1E88E5]"
                }`}
                placeholder="Nhập mật khẩu"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 mt-2 text-red-600 text-sm"
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.password}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  handleInputChange("rememberMe", e.target.checked)
                }
                className="w-4 h-4 text-[#1E88E5] border-gray-300 rounded focus:ring-[#1E88E5] focus:ring-2"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-[#1E88E5] hover:text-[#1565C0] font-medium transition-colors"
              disabled={isLoading}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading || loginSuccess}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${
              isLoading || loginSuccess
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1E88E5] hover:bg-[#1565C0] shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang đăng nhập...
              </>
            ) : loginSuccess ? (
              <>
                <BiCheckCircle className="w-5 h-5" />
                Thành công!
              </>
            ) : (
              <>
                Đăng nhập
                <FaArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{" "}
            <button
              onClick={onSignUp}
              className="text-[#1E88E5] hover:text-[#1565C0] font-medium transition-colors"
              disabled={isLoading}
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [ setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    capital: false,
    small: false,
    specialChar: false,
  });
  const [generalError, setGeneralError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      password: value,
    });
    validatePassword(value);
  };

  const validatePassword = (password) => {
    const errors = {
      length: password.length >= 5,
      number: /\d/.test(password),
      capital: /[A-Z]/.test(password),
      small: /[a-z]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordErrors(errors);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    const passwordValid =
      passwordErrors.length &&
      passwordErrors.number &&
      passwordErrors.capital &&
      passwordErrors.small &&
      passwordErrors.specialChar;

    if (!passwordValid) {
      setGeneralError('Lütfen şifre kriterlerini sağlayın.');
      return;
    }

    try {
      // Backend API'ye istek gönder
      const response = await axios.post('https://fileappbackend-production.up.railway.app/auth/signup', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      // Başarılı signup sonrası kullanıcının verisini ve token'ı sakla
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      signup(user);
      
      setMessage('Kayıt başarılı. Lütfen emailinizi kontrol edin.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Kayıt sırasında bir hata oluştu:', error);
      setGeneralError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 pt-24 mx-auto md:h-screen lg:py-0 bg-gradient-to-r from-green-400 to-blue-500">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Hesap Oluştur
            </h1>
            {message && <div className="text-green-500">{message}</div>}
            <form onSubmit={handleSignup} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ad</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Ad"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Soyad</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Soyad"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Adresi</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@gmail.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Şifre</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.password}
                  onChange={handlePasswordChange}
                />
                <div className="mt-2 text-sm text-gray-600">
                  <p className={passwordErrors.length ? "text-green-500" : "text-red-500"}>En az 5 karakter olmalı</p>
                  <p className={passwordErrors.number ? "text-green-500" : "text-red-500"}>En az 1 sayı içermeli</p>
                  <p className={passwordErrors.capital ? "text-green-500" : "text-red-500"}>En az 1 büyük harf içermeli</p>
                  <p className={passwordErrors.small ? "text-green-500" : "text-red-500"}>En az 1 küçük harf içermeli</p>
                  <p className={passwordErrors.specialChar ? "text-green-500" : "text-red-500"}>En az 1 özel karakter içermeli</p>
                </div>
              </div>

              <button type="submit" className="w-full text-white bg-red-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Hesap Oluştur
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Hesabın var mı?{" "}
                <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Giriş Yap
                </Link>
              </p>
            </form>
            {generalError && <div className="text-red-500 text-sm">{generalError}</div>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
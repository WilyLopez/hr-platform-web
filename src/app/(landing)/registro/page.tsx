'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    aceptaTerminos: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validaciones
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.aceptaTerminos) {
      newErrors.terminos = 'Debes aceptar los términos y condiciones';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si pasa validaciones, ir a siguiente paso
    console.log('Formulario válido:', formData);
    window.location.href = '/registro/datos';
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-white min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-500 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⌂</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SisRRHH</span>
            </Link>
            <div className="text-sm text-gray-600">
              ¿Ya tienes cuenta? <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">Inicia Sesión</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 lg:py-0 lg:min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Progress */}
            <div className="flex items-center justify-between mb-8">
              <div className="text-center flex-1">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  1
                </div>
                <p className="text-sm font-medium text-gray-900">Credenciales</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 mb-5"></div>
              <div className="text-center flex-1">
                <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  2
                </div>
                <p className="text-sm font-medium text-gray-600">Datos</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 mb-5"></div>
              <div className="text-center flex-1">
                <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  3
                </div>
                <p className="text-sm font-medium text-gray-600">Confirmación</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu Cuenta</h1>
            <p className="text-gray-600 mb-8">Comienza tu prueba gratuita de 14 días</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terminos"
                  name="aceptaTerminos"
                  checked={formData.aceptaTerminos}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4"
                />
                <label htmlFor="terminos" className="ml-3 text-sm text-gray-700">
                  Acepto los{' '}
                  <Link href="/terminos" className="text-blue-600 hover:text-blue-700 font-medium">
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link href="/privacidad" className="text-blue-600 hover:text-blue-700 font-medium">
                    Política de Privacidad
                  </Link>
                </label>
              </div>
              {errors.terminos && <p className="text-red-500 text-sm">{errors.terminos}</p>}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Continuar
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia Sesión
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl mb-1">✓</p>
              <p className="text-sm text-gray-600">14 días gratis</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1">✓</p>
              <p className="text-sm text-gray-600">Sin tarjeta</p>
            </div>
            <div className="text-center">
              <p className="text-2xl mb-1">✓</p>
              <p className="text-sm text-gray-600">Acceso completo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

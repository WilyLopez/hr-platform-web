'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DatosPage() {
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    nroEmpleados: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    cargo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.nombreEmpresa) newErrors.nombreEmpresa = 'El nombre de la empresa es requerido';
    if (!formData.nroEmpleados) newErrors.nroEmpleados = 'Selecciona el número de empleados';
    if (!formData.nombres) newErrors.nombres = 'El nombre es requerido';
    if (!formData.apellidos) newErrors.apellidos = 'El apellido es requerido';
    if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.cargo) newErrors.cargo = 'El cargo es requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Datos de empresa:', formData);
    window.location.href = '/registro/confirmacion';
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
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  ✓
                </div>
                <p className="text-sm font-medium text-gray-900">Credenciales</p>
              </div>
              <div className="flex-1 h-1 bg-blue-500 mx-2 mb-5"></div>
              <div className="text-center flex-1">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  2
                </div>
                <p className="text-sm font-medium text-gray-900">Datos</p>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-2 mb-5"></div>
              <div className="text-center flex-1">
                <div className="bg-gray-300 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold mb-2">
                  3
                </div>
                <p className="text-sm font-medium text-gray-600">Confirmación</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Datos de tu Empresa</h1>
            <p className="text-gray-600 mb-8">Cuéntanos sobre tu organización</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombreEmpresa" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  id="nombreEmpresa"
                  name="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombreEmpresa ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mi Empresa S.A.C."
                />
                {errors.nombreEmpresa && <p className="text-red-500 text-sm mt-1">{errors.nombreEmpresa}</p>}
              </div>

              <div>
                <label htmlFor="nroEmpleados" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Empleados
                </label>
                <select
                  id="nroEmpleados"
                  name="nroEmpleados"
                  value={formData.nroEmpleados}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nroEmpleados ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona...</option>
                  <option value="1-10">1 a 10</option>
                  <option value="11-50">11 a 50</option>
                  <option value="51-100">51 a 100</option>
                  <option value="101-200">101 a 200</option>
                  <option value="201+">Más de 200</option>
                </select>
                {errors.nroEmpleados && <p className="text-red-500 text-sm mt-1">{errors.nroEmpleados}</p>}
              </div>

              <div>
                <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombres
                </label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.nombres ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu nombre"
                />
                {errors.nombres && <p className="text-red-500 text-sm mt-1">{errors.nombres}</p>}
              </div>

              <div>
                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.apellidos ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tu apellido"
                />
                {errors.apellidos && <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>}
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.telefono ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+51 1234567890"
                />
                {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}
              </div>

              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <select
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.cargo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona...</option>
                  <option value="gerente-general">Gerente General</option>
                  <option value="gerente-rrhh">Gerente de RRHH</option>
                  <option value="jefe-rrhh">Jefe de RRHH</option>
                  <option value="especialista-rrhh">Especialista de RRHH</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.cargo && <p className="text-red-500 text-sm mt-1">{errors.cargo}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium transition mt-6"
              >
                Continuar
              </button>
            </form>

            <Link href="/registro" className="block text-center text-gray-600 text-sm mt-4 hover:text-gray-900">
              ← Volver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

export function LandingPageCustomisationForm() {
  const [formData, setFormData] = useState({
    storeName: '',
    tagline: '',
    logoUrl: '',
    primaryColor: '#000000',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert('Store settings saved successfully!');
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Customize Your Store
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Store Name */}
        <div>
          <label
            htmlFor="storeName"
            className="block text-sm font-medium text-gray-700"
          >
            Store Name
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter your store name"
            required
          />
        </div>

        {/* Tagline */}
        <div>
          <label
            htmlFor="tagline"
            className="block text-sm font-medium text-gray-700"
          >
            Tagline
          </label>
          <textarea
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Enter your store's tagline"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label
            htmlFor="logoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Logo URL
          </label>
          <input
            type="url"
            id="logoUrl"
            name="logoUrl"
            value={formData.logoUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
            placeholder="Paste your logo URL"
          />
        </div>

        {/* Primary Color */}
        <div>
          <label
            htmlFor="primaryColor"
            className="block text-sm font-medium text-gray-700"
          >
            Primary Color
          </label>
          <input
            type="color"
            id="primaryColor"
            name="primaryColor"
            value={formData.primaryColor}
            onChange={handleChange}
            className="mt-1 h-10 w-full rounded-md border shadow-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            Save Customization
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

export function BillingForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: '',
    cardNumber: '',
    expiration: '',
    cvv: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Billing Info Submitted:', formData);
    alert('Billing information saved successfully!');
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-bold">
        Billing Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullname"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullname"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            placeholder="Enter email"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            placeholder="Enter address"
            required
          />
        </div>

        {/* City & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
              placeholder="Enter city"
              required
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
              required
            >
              <option value="">Select country</option>
              <option value="USA">United States</option>
              <option value="Canada">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
        </div>

        {/* Payment Details */}
        <h3 className="mt-4 text-lg font-semibold">Payment Details</h3>

        <div>
          <label
            htmlFor="cardNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            placeholder="1234 5678 9012 3456"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="expiration"
              className="block text-sm font-medium text-gray-700"
            >
              Expiration Date
            </label>
            <input
              type="text"
              id="expiration"
              name="expiration"
              value={formData.expiration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
              placeholder="MM/YY"
              required
            />
          </div>

          <div>
            <label
              htmlFor="cvv"
              className="block text-sm font-medium text-gray-700"
            >
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
              placeholder="123"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 font-semibold text-white transition hover:bg-green-700"
          >
            Save Billing Info
          </button>
        </div>
      </form>
    </div>
  );
}

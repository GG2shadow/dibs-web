import React from 'react';

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
}

export default function CustomerInfoModal({
  isOpen,
  onClose,
  customer,
}: CustomerModalProps) {
  if (!isOpen) return null; // Don't render the modal if it's closed

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      {/* Modal backdrop */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>

        {/* Modal content container */}
        <div className="z-20 transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Customer Information
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                <strong>Name:</strong> {customer.name}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Email:</strong> {customer.email}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Phone:</strong> {customer.phone}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

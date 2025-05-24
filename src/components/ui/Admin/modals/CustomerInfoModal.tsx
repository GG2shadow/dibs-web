import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Customer {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onSave?: (updatedCustomer: Customer) => void;
}

export default function CustomerInfoModal({
  isOpen,
  onClose,
  customer,
  onSave,
}: CustomerModalProps) {
  const [editedCustomer, setEditedCustomer] = useState<Customer>(customer);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedCustomer(customer);
    setIsEditing(false);
    setHasChanges(false);
  }, [customer]);

  const handleInputChange = (field: keyof Customer, value: string) => {
    setEditedCustomer(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedCustomer);
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" />
      
      {/* Modal content container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className={cn(
            "relative w-full max-w-lg transform overflow-hidden rounded-lg bg-background p-6 shadow-lg transition-all",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </button>

          {/* Modal content */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              Customer Information
            </h2>
            
            <div className="space-y-3">
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  <Label className="font-['Inter']">Name</Label>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedCustomer.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <p className="text-sm">{editedCustomer.name}</p>
                )}
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <Label className="font-['Inter']">Email</Label>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedCustomer.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <p className="text-sm">{editedCustomer.email}</p>
                )}
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <Label className="font-['Inter']">Phone</Label>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedCustomer.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                ) : (
                  <p className="text-sm">{editedCustomer.phone}</p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center gap-2">
                  <StickyNote className="size-4 text-muted-foreground" />
                  <Label className="font-['Inter']">Notes</Label>
                </div>
                {isEditing ? (
                  <Textarea
                    value={editedCustomer.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any additional notes about the customer..."
                    className="min-h-[100px] resize-none"
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{editedCustomer.notes || 'No notes'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Modal footer */}
          <div className="mt-6 flex justify-end gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedCustomer(customer);
                    setHasChanges(false);
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Cancel
                </button>
                {hasChanges && (
                  <button
                    onClick={handleSave}
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-dibs-red px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    Save
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

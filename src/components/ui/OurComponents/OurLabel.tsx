import React from 'react';

import { Label } from '../label';

interface OurLabelProps {
  children: React.ReactNode;
}

const OurLabel: React.FC<OurLabelProps> = ({ children }) => {
  return (
    <div className="mb-2">
      <Label>{children}</Label>
    </div>
  );
};

export default OurLabel;

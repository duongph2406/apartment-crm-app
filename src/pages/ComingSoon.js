import React from 'react';
import { Construction } from 'lucide-react';

const ComingSoon = ({ title, description }) => {
  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <Construction size={64} color="#3498db" />
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="coming-soon-note">
          <p>Tính năng này đang được phát triển và sẽ sớm được cập nhật.</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
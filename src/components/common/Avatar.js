import React from 'react';
import { User } from 'lucide-react';
import { generateAvatarFromName, getAvatarColor, isValidImageUrl } from '../../utils/avatar';

const Avatar = ({ 
  user, 
  size = 40, 
  className = '', 
  showOnlineStatus = false,
  onClick = null 
}) => {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: getAvatarColor(user?.fullName || ''),
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0
  };

  const renderAvatarContent = () => {
    // Nếu có avatar URL hợp lệ
    if (user?.avatar && isValidImageUrl(user.avatar)) {
      return (
        <img
          src={user.avatar}
          alt={user.fullName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Fallback nếu image load lỗi
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    // Nếu có avatar data URL
    if (user?.avatar && user.avatar.startsWith('data:')) {
      return (
        <img
          src={user.avatar}
          alt={user.fullName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      );
    }
    
    // Fallback: hiển thị initials hoặc icon
    if (user?.fullName) {
      return generateAvatarFromName(user.fullName);
    }
    
    return <User size={size * 0.6} />;
  };

  return (
    <div 
      className={`avatar ${className}`}
      style={avatarStyle}
      onClick={onClick}
      title={user?.fullName}
    >
      {renderAvatarContent()}
      
      {showOnlineStatus && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.25,
            height: size * 0.25,
            backgroundColor: '#27ae60',
            border: '2px solid white',
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
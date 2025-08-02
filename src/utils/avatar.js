// Utility functions for avatar handling

// Tạo avatar từ tên người dùng
export const generateAvatarFromName = (name) => {
  if (!name) return '';
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return initials;
};

// Tạo màu nền avatar từ tên
export const getAvatarColor = (name) => {
  if (!name) return '#95a5a6';
  
  const colors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
    '#9b59b6', '#1abc9c', '#34495e', '#e67e22',
    '#8e44ad', '#27ae60', '#2980b9', '#f1c40f'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Kiểm tra xem có phải URL hợp lệ không
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  } catch {
    return false;
  }
};

// Tạo data URL cho avatar text
export const createTextAvatar = (name, size = 80) => {
  const initials = generateAvatarFromName(name);
  const backgroundColor = getAvatarColor(name);
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // Vẽ background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);
  
  // Vẽ text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.4}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, size / 2, size / 2);
  
  return canvas.toDataURL();
};

// Resize image để tối ưu storage
export const resizeImage = (file, maxWidth = 200, maxHeight = 200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Tính toán kích thước mới
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Vẽ image đã resize
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Validate file upload
export const validateImageFile = (file) => {
  const errors = [];
  
  // Kiểm tra loại file
  if (!file.type.startsWith('image/')) {
    errors.push('File phải là hình ảnh');
  }
  
  // Kiểm tra kích thước (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.push('Kích thước file không được vượt quá 5MB');
  }
  
  // Kiểm tra định dạng
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Chỉ hỗ trợ các định dạng: JPG, PNG, GIF, WebP');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
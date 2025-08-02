import { storage } from './localStorage';
import { USER_ROLES } from '../constants/roles';

// Khởi tạo dữ liệu mặc định
export const initializeDefaultData = () => {
  const existingUsers = storage.getUsers();
  
  if (existingUsers.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        fullName: 'Quản trị viên',
        role: USER_ROLES.ADMIN,
        email: 'admin@apartment.com',
        phone: '0123456789',
        createdAt: new Date().toISOString()
      },
      {
        id: '2', 
        username: 'manager',
        password: 'manager123',
        fullName: 'Quản lý',
        role: USER_ROLES.MANAGER,
        email: 'manager@apartment.com',
        phone: '0123456788',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        username: 'user',
        password: 'user123', 
        fullName: 'Nhân viên',
        role: USER_ROLES.USER,
        email: 'user@apartment.com',
        phone: '0123456787',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        username: 'tenant1',
        password: 'tenant123',
        fullName: 'Nguyễn Văn A',
        role: USER_ROLES.TENANT,
        email: 'tenant1@gmail.com',
        phone: '0987654321',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        username: 'tenant2',
        password: 'tenant123',
        fullName: 'Trần Thị B',
        role: USER_ROLES.TENANT,
        email: 'tenant2@gmail.com',
        phone: '0987654322',
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        username: 'tenant3',
        password: 'tenant123',
        fullName: 'Lê Văn C',
        role: USER_ROLES.TENANT,
        email: 'tenant3@gmail.com',
        phone: '0987654323',
        createdAt: new Date().toISOString()
      }
    ];
    
    storage.setUsers(defaultUsers);
  }

  // Khởi tạo dữ liệu sự cố mẫu
  const existingIncidents = storage.getIncidents();
  if (existingIncidents.length === 0) {
    const sampleIncidents = [
      {
        id: '1',
        title: 'Điện mất điện phòng 101',
        description: 'Phòng 101 bị mất điện từ sáng nay, không có điện trong toàn bộ phòng. Đã kiểm tra cầu dao nhưng không có vấn đề gì.',
        category: 'electrical',
        priority: 'high',
        roomId: '1',
        reportedBy: 'Nguyễn Văn A',
        reportedByEmail: 'tenant1@gmail.com',
        contactInfo: '0987654321',
        status: 'reported',
        assignedTo: '',
        estimatedCost: '',
        actualCost: '',
        notes: '',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'reported',
            changedBy: 'tenant1@gmail.com',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Sự cố được báo cáo'
          }
        ]
      },
      {
        id: '2',
        title: 'Rò rỉ nước tại phòng tắm',
        description: 'Phòng tắm tầng 2 bị rò rỉ nước từ trần, nước nhỏ giọt liên tục. Có thể do đường ống nước bên trên bị hỏng.',
        category: 'plumbing',
        priority: 'medium',
        roomId: '',
        reportedBy: 'Quản lý tòa nhà',
        reportedByEmail: 'manager@apartment.com',
        contactInfo: '0123456788',
        status: 'in_progress',
        assignedTo: 'Thợ sửa ống nước Minh',
        estimatedCost: '500000',
        actualCost: '',
        notes: 'Đã liên hệ thợ sửa, dự kiến hoàn thành trong 2 ngày',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'reported',
            changedBy: 'manager@apartment.com',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Sự cố được báo cáo'
          },
          {
            status: 'confirmed',
            changedBy: 'admin@apartment.com',
            changedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã xác nhận sự cố, cần sửa chữa ngay'
          },
          {
            status: 'in_progress',
            changedBy: 'admin@apartment.com',
            changedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã phân công thợ sửa chữa'
          }
        ]
      },
      {
        id: '3',
        title: 'Internet chậm tại phòng 203',
        description: 'Tốc độ internet tại phòng 203 rất chậm, không thể xem video hoặc tải file. Đã thử khởi động lại modem nhưng không cải thiện.',
        category: 'internet',
        priority: 'low',
        roomId: '3',
        reportedBy: 'Trần Thị B',
        reportedByEmail: 'tenant2@gmail.com',
        contactInfo: '0987654322',
        status: 'resolved',
        assignedTo: 'Kỹ thuật viên IT',
        estimatedCost: '0',
        actualCost: '0',
        notes: 'Đã kiểm tra và cấu hình lại router, tốc độ đã trở lại bình thường',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'reported',
            changedBy: 'tenant2@gmail.com',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Sự cố được báo cáo'
          },
          {
            status: 'confirmed',
            changedBy: 'user@apartment.com',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã xác nhận và phân công xử lý'
          },
          {
            status: 'in_progress',
            changedBy: 'user@apartment.com',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Kỹ thuật viên đang kiểm tra'
          },
          {
            status: 'resolved',
            changedBy: 'user@apartment.com',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã khắc phục xong, internet hoạt động bình thường'
          }
        ]
      },
      {
        id: '4',
        title: 'Cửa chính bị kẹt',
        description: 'Cửa chính tòa nhà bị kẹt, khó đóng mở. Có thể do bản lề bị hỏng hoặc cần bôi trơn.',
        category: 'maintenance',
        priority: 'urgent',
        roomId: '',
        reportedBy: 'Bảo vệ',
        reportedByEmail: 'security@apartment.com',
        contactInfo: '0123456786',
        status: 'confirmed',
        assignedTo: '',
        estimatedCost: '200000',
        actualCost: '',
        notes: 'Cần xử lý ngay để đảm bảo an toàn ra vào',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'reported',
            changedBy: 'security@apartment.com',
            changedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            notes: 'Sự cố được báo cáo'
          },
          {
            status: 'confirmed',
            changedBy: 'manager@apartment.com',
            changedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã xác nhận, cần xử lý khẩn cấp'
          }
        ]
      }
    ];
    
    storage.setIncidents(sampleIncidents);
  }

  // Khởi tạo dữ liệu phản ánh mẫu
  const existingFeedbacks = storage.getFeedbacks();
  if (existingFeedbacks.length === 0) {
    const sampleFeedbacks = [
      {
        id: '1',
        title: 'Dịch vụ vệ sinh rất tốt',
        description: 'Tôi rất hài lòng với dịch vụ vệ sinh của tòa nhà. Nhân viên làm việc rất tận tâm và sạch sẽ. Khu vực chung luôn được giữ gìn sạch đẹp.',
        type: 'compliment',
        rating: 5,
        roomId: '102',
        submittedBy: 'Nguyễn Văn A',
        submittedByEmail: 'tenant1@gmail.com',
        contactInfo: '0987654321',
        status: 'responded',
        response: 'Cảm ơn bạn đã đánh giá tích cực. Chúng tôi sẽ tiếp tục duy trì chất lượng dịch vụ.',
        responseBy: 'manager@apartment.com',
        priority: 'low',
        category: 'cleanliness',
        isAnonymous: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'tenant1@gmail.com',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Phản ánh được tạo'
          },
          {
            status: 'responded',
            changedBy: 'manager@apartment.com',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã phản hồi khách hàng'
          }
        ]
      },
      {
        id: '2',
        title: 'Tiếng ồn từ phòng bên cạnh',
        description: 'Phòng bên cạnh thường xuyên có tiếng ồn lớn vào ban đêm, ảnh hưởng đến giấc ngủ. Tôi mong ban quản lý có thể nhắc nhở họ.',
        type: 'complaint',
        rating: 2,
        roomId: '201',
        submittedBy: 'Trần Thị B',
        submittedByEmail: 'tenant2@gmail.com',
        contactInfo: '0987654322',
        status: 'reviewing',
        response: '',
        responseBy: '',
        priority: 'medium',
        category: 'noise',
        isAnonymous: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'tenant2@gmail.com',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Phản ánh được tạo'
          },
          {
            status: 'reviewing',
            changedBy: 'manager@apartment.com',
            changedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            notes: 'Đang xem xét và tìm hiểu tình hình'
          }
        ]
      },
      {
        id: '3',
        title: 'Đề xuất cải thiện hệ thống thang máy',
        description: 'Tôi đề xuất nên lắp đặt thêm camera trong thang máy và cải thiện hệ thống thông gió. Thang máy hiện tại khá ngột ngạt vào mùa hè.',
        type: 'suggestion',
        rating: 4,
        roomId: '',
        submittedBy: 'Lê Văn C',
        submittedByEmail: 'tenant3@gmail.com',
        contactInfo: '0987654323',
        status: 'resolved',
        response: 'Cảm ơn đề xuất của bạn. Chúng tôi đã lên kế hoạch lắp đặt camera và sẽ kiểm tra hệ thống thông gió trong tháng tới.',
        responseBy: 'admin@apartment.com',
        priority: 'medium',
        category: 'facility',
        isAnonymous: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'tenant3@gmail.com',
            changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Phản ánh được tạo'
          },
          {
            status: 'reviewing',
            changedBy: 'manager@apartment.com',
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đang xem xét khả năng thực hiện'
          },
          {
            status: 'responded',
            changedBy: 'admin@apartment.com',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã phản hồi và lên kế hoạch thực hiện'
          },
          {
            status: 'resolved',
            changedBy: 'admin@apartment.com',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã hoàn thành lắp đặt camera, sẽ kiểm tra thông gió'
          }
        ]
      },
      {
        id: '4',
        title: 'Câu hỏi về quy định nuôi thú cưng',
        description: 'Tôi muốn hỏi về quy định nuôi thú cưng trong tòa nhà. Hiện tại tôi có ý định nuôi một chú chó nhỏ, không biết có được phép không?',
        type: 'question',
        rating: 3,
        roomId: '301',
        submittedBy: 'Phạm Thị D',
        submittedByEmail: 'tenant4@gmail.com',
        contactInfo: '0987654324',
        status: 'responded',
        response: 'Theo quy định của tòa nhà, chúng tôi cho phép nuôi thú cưng nhỏ (dưới 10kg) với điều kiện đăng ký trước và tuân thủ các quy tắc vệ sinh. Bạn có thể liên hệ văn phòng để làm thủ tục.',
        responseBy: 'manager@apartment.com',
        priority: 'low',
        category: 'management',
        isAnonymous: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'tenant4@gmail.com',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Phản ánh được tạo'
          },
          {
            status: 'responded',
            changedBy: 'manager@apartment.com',
            changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Đã trả lời câu hỏi của khách hàng'
          }
        ]
      },
      {
        id: '5',
        title: 'Yêu cầu sửa chữa khóa cửa',
        description: 'Khóa cửa phòng tôi bị kẹt, khó khóa và mở. Tôi yêu cầu ban quản lý sắp xếp thợ đến sửa chữa.',
        type: 'request',
        rating: 3,
        roomId: '401',
        submittedBy: 'Hoàng Văn E',
        submittedByEmail: 'tenant5@gmail.com',
        contactInfo: '0987654325',
        status: 'pending',
        response: '',
        responseBy: '',
        priority: 'high',
        category: 'maintenance',
        isAnonymous: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'tenant5@gmail.com',
            changedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            notes: 'Phản ánh được tạo'
          }
        ]
      },
      {
        id: '6',
        title: 'Phản ánh về chất lượng nước',
        description: 'Nước máy có mùi lạ và màu hơi đục. Tôi lo ngại về chất lượng nước sinh hoạt và mong ban quản lý kiểm tra.',
        type: 'complaint',
        rating: 2,
        roomId: '',
        submittedBy: 'Người dân ẩn danh',
        submittedByEmail: 'tenant6@gmail.com',
        contactInfo: '',
        status: 'reviewing',
        response: '',
        responseBy: '',
        priority: 'urgent',
        category: 'facility',
        isAnonymous: true,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            status: 'pending',
            changedBy: 'tenant6@gmail.com',
            changedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            notes: 'Phản ánh được tạo'
          },
          {
            status: 'reviewing',
            changedBy: 'admin@apartment.com',
            changedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            notes: 'Đang kiểm tra hệ thống cấp nước'
          }
        ]
      }
    ];
    
    storage.setFeedbacks(sampleFeedbacks);
  }
};

export const login = (username, password) => {
  const users = storage.getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    storage.setCurrentUser(user);
    return { success: true, user };
  }
  
  return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng' };
};

export const logout = () => {
  storage.removeCurrentUser();
};

export const getCurrentUser = () => {
  return storage.getCurrentUser();
};

export const isAuthenticated = () => {
  return !!storage.getCurrentUser();
};
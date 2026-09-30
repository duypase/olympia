import type { ObstacleData, Round1Question, Team } from '../types/game';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'Đội 1: Sao Khuê',
    score: 0,
    canGuessObstacle: true,
    color: '#3B82F6', // Blue
  },
  {
    id: 'team-2',
    name: 'Đội 2: Kim Quy',
    score: 0,
    canGuessObstacle: true,
    color: '#EAB308', // Gold / Amber
  },
  {
    id: 'team-3',
    name: 'Đội 3: Hỏa Long',
    score: 0,
    canGuessObstacle: true,
    color: '#EF4444', // Red
  },
  {
    id: 'team-4',
    name: 'Đội 4: Thăng Long',
    score: 0,
    canGuessObstacle: true,
    color: '#10B981', // Emerald
  },
  {
    id: 'team-5',
    name: 'Đội 5: Bạch Hổ',
    score: 0,
    canGuessObstacle: true,
    color: '#8B5CF6', // Purple
  },
  {
    id: 'team-6',
    name: 'Đội 6: Huyền Vũ',
    score: 0,
    canGuessObstacle: true,
    color: '#06B6D4', // Cyan
  },
];

export const MOCK_ROUND1_QUESTIONS: Round1Question[] = [
  {
    id: 1,
    question: 'Theo số liệu thống kê địa lý của Tổng cục Khí tượng Thủy văn và Hải văn Quốc gia, tỉnh nào tại Việt Nam sở hữu đường bờ biển khúc khuỷu dài nhất với tổng chiều dài lên tới 385 km?',
    options: [
      'Quảng Ninh (với hơn hai ngàn hòn đảo đá vôi và vịnh biển kỳ vĩ)',
      'Khánh Hòa (sở hữu vịnh Vân Phong, vịnh Nha Trang và vịnh Cam Ranh)',
      'Bình Thuận (với dải đụn cát ven biển Mũi Né dài hàng chục km)',
      'Cà Mau (mũi đất cực Nam tiếp giáp cả Biển Đông và Vịnh Thái Lan)',
    ],
    answer: 'Khánh Hòa (sở hữu vịnh Vân Phong, vịnh Nha Trang và vịnh Cam Ranh)',
    correctOptionIndex: 1,
    timeLimit: 10,
  },
  {
    id: 2,
    question: 'Trong hệ Mặt Trời, hành tinh đất đá nào có hiện tượng nghịch lý thiên văn đặc biệt khi thời gian tự quay một vòng quanh trục của nó (243 ngày Trái Đất) dài hơn cả chu kỳ quỹ đạo quay quanh Mặt Trời (225 ngày Trái Đất)?',
    options: [
      'Sao Kim (Kim tinh - hành tinh sáng nhất trên bầu trời hoàng hôn)',
      'Sao Thủy (Thủy tinh - hành tinh nhỏ nhất nằm gần Mặt Trời nhất)',
      'Sao Hỏa (Hỏa tinh - hành tinh đỏ với đỉnh núi Olympus Mons hùng vĩ)',
      'Sao Mộc (Mộc tinh - khối khí khổng lồ có Vết Đỏ Lớn tồn tại hàng thế kỷ)',
    ],
    answer: 'Sao Kim (Kim tinh - hành tinh sáng nhất trên bầu trời hoàng hôn)',
    correctOptionIndex: 0,
    timeLimit: 10,
  },
  {
    id: 3,
    question: 'Trong kiệt tác văn học trung đại "Đoạn trường tân thanh" (Truyện Kiều) của Đại thi hào Nguyễn Du, nhân vật Thúy Kiều và Thúy Vân mang họ khai sinh nào trong gia đình viên ngoại họ này?',
    options: [
      'Nguyễn (cùng dòng tộc với tác giả Nguyễn Du và Nguyễn Khuyến)',
      'Trần (dòng họ hoàng tộc triều Trần với hào khí Đông A oanh liệt)',
      'Lê (triều đại phong kiến kéo dài thịnh trị bậc nhất lịch sử Đại Việt)',
      'Vương (gia đình trung lưu viên ngoại Vương ông, Vương bà và Vương Quan)',
    ],
    answer: 'Vương (gia đình trung lưu viên ngoại Vương ông, Vương bà và Vương Quan)',
    correctOptionIndex: 3,
    timeLimit: 10,
  },
  {
    id: 4,
    question: 'Nguyên tố hóa học nào có ký hiệu là "W" trong bảng tuần hoàn Mendeleev?',
    options: [
      'Kim loại Vàng (ký hiệu nguyên tố hóa học Au - Aurum)',
      'Bạch kim hay Platinum (ký hiệu nguyên tố hóa học Pt)',
      'Wolfram hay Tungsten (kim loại có nhiệt độ nóng chảy cao nhất tới 3.422 °C)',
      'Chì kim loại nặng màu xám (ký hiệu nguyên tố hóa học Pb - Plumbum)',
    ],
    answer: 'Wolfram hay Tungsten (kim loại có nhiệt độ nóng chảy cao nhất tới 3.422 °C)',
    correctOptionIndex: 2,
    timeLimit: 10,
  },
  {
    id: 5,
    question: 'Khu vực vịnh biển nào của Việt Nam với hàng ngàn đảo đá vôi kỳ vĩ đã vinh dự được tổ chức UNESCO hai lần công nhận là Di sản Thiên nhiên Thế giới về giá trị thẩm mỹ và giá trị địa chất - địa mạo vào các năm 1994 và 2000?',
    options: [
      'Vịnh Hạ Long (thuộc tỉnh Quảng Ninh, kỳ quan thiên nhiên thế giới nổi tiếng)',
      'Vịnh Nha Trang (một trong những vịnh biển nhiệt đới đẹp nhất thế giới)',
      'Vịnh Lăng Cô (vịnh biển thơ mộng nằm dưới chân đèo Hải Vân tỉnh Thừa Thiên Huế)',
      'Vịnh Xuân Đài (vịnh biển hoang sơ tuyệt đẹp thuộc địa phận tỉnh Phú Yên)',
    ],
    answer: 'Vịnh Hạ Long (thuộc tỉnh Quảng Ninh, kỳ quan thiên nhiên thế giới nổi tiếng)',
    correctOptionIndex: 0,
    timeLimit: 10,
  },
  {
    id: 6,
    question: 'Cầu thủ bóng đá nào là người đầu tiên và duy nhất trong lịch sử từng 3 lần vô địch World Cup?',
    options: ['Diego Maradona', 'Pelé', 'Lionel Messi', 'Zinedine Zidane'],
    answer: 'Pelé',
    correctOptionIndex: 1,
    timeLimit: 10,
  },
  {
    id: 7,
    question: 'Loại hạt cơ bản nào mang điện tích âm và quay xung quanh hạt nhân nguyên tử?',
    options: ['Electron', 'Proton', 'Neutron', 'Positron'],
    answer: 'Electron',
    correctOptionIndex: 0,
    timeLimit: 10,
  },
  {
    id: 8,
    question: 'Trận đánh nào được coi là đỉnh cao của Chiến dịch Hồ Chí Minh lịch sử, giải phóng hoàn toàn miền Nam năm 1975?',
    options: ['Chiến dịch Tây Nguyên', 'Chiến dịch Huế - Đà Nẵng', 'Tiến công Dinh Độc Lập', 'Trận Xuân Lộc'],
    answer: 'Tiến công Dinh Độc Lập (30/4/1975)',
    correctOptionIndex: 2,
    timeLimit: 10,
  },
  {
    id: 9,
    question: 'Tập hợp các số nguyên trong toán học thường được ký hiệu bằng chữ cái in hoa nào?',
    options: ['Z', 'N', 'R', 'Q'],
    answer: 'Z',
    correctOptionIndex: 0,
    timeLimit: 10,
  },
  {
    id: 10,
    question: 'Đỉnh núi Fansipan – nóc nhà của Đông Dương thuộc dãy núi nào ở Việt Nam?',
    options: ['Trường Sơn Bắc', 'Hoàng Liên Sơn', 'Trường Sơn Nam', 'Bạch Mã'],
    answer: 'Hoàng Liên Sơn',
    correctOptionIndex: 1,
    timeLimit: 10,
  },
];

export const MOCK_OBSTACLE_DATA: ObstacleData = {
  keyword: 'TRỐNG ĐỒNG ĐÔNG SƠN',
  description: 'Biểu tượng văn hóa tinh hoa của nền văn minh lúa nước và lịch sử người Việt cổ thời kỳ Hùng Vương.',
  // High quality Unsplash image of bronze drum culture / ancient heritage
  imageUrl: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&w=1200&q=80',
  isFullyRevealed: false,
  clues: [
    {
      id: 1,
      rowLabel: 'Hàng ngang 1 (9 chữ cái)',
      question: 'Thời kỳ các vua nào trong truyền thuyết được coi là đã sáng lập nên nhà nước Văn Lang cổ đại?',
      answer: 'HÙNG VƯƠNG',
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 2,
      rowLabel: 'Hàng ngang 2 (8 chữ cái)',
      question: 'Kim loại chủ đạo được cư dân Việt cổ sử dụng để đúc ra các nhạc khí và vũ khí thời đồ đồng là gì?',
      answer: 'ĐỒNG THAU',
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 3,
      rowLabel: 'Hàng ngang 3 (7 chữ cái)',
      question: 'Hình tượng loài chim sải cánh bay được khắc họa rất nhiều trên mặt trống đồng cổ đại là chim gì?',
      answer: 'CHIM LẠC',
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 4,
      rowLabel: 'Hàng ngang 4 (7 chữ cái)',
      question: 'Hình tượng ngôi sao nhiều cánh ở chính giữa mặt trống đồng tượng trưng cho điều gì trong tín ngưỡng sơ khai?',
      answer: 'MẶT TRỜI',
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 5,
      rowLabel: 'Hàng ngang 5 (7 chữ cái)',
      question: 'Địa danh khảo cổ đầu tiên phát hiện ra loại trống đồng tiêu biểu này thuộc tỉnh Thanh Hóa ngày nay là gì?',
      answer: 'ĐÔNG SƠN',
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 6,
      rowLabel: 'Hàng ngang 6 (6 chữ cái)',
      question: 'Dòng sông lớn chảy qua vùng đất Đông Sơn, nơi tập trung nhiều di chỉ khảo cổ đồ đồng thời Văn Lang là sông gì?',
      answer: 'SÔNG MÃ',
      isRevealed: false,
      timeLimit: 20,
    },
  ],
};

export function getCorrectOptionIndex(q?: Partial<Round1Question> | null): number {
  if (!q) return 0;
  if (typeof q.correctOptionIndex === 'number' && q.correctOptionIndex >= 0) {
    return q.correctOptionIndex;
  }
  // Lookup in MOCK_ROUND1_QUESTIONS by ID
  const mockQ = MOCK_ROUND1_QUESTIONS.find(m => m.id === q.id);
  if (mockQ && typeof mockQ.correctOptionIndex === 'number') {
    return mockQ.correctOptionIndex;
  }
  // Lookup by matching answer string in options
  if (q.options && q.answer) {
    const cleanAnswer = q.answer.toLowerCase();
    const idx = q.options.findIndex(opt => {
      const cleanOpt = opt.toLowerCase();
      return cleanAnswer.includes(cleanOpt) || cleanOpt.includes(cleanAnswer);
    });
    if (idx !== -1) return idx;
  }
  return 0;
}

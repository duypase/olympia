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
];

export const MOCK_ROUND1_QUESTIONS: Round1Question[] = [
  {
    id: 1,
    question: 'Tỉnh nào ở nước ta có đường bờ biển dài nhất với 385 km?',
    options: ['Khánh Hòa', 'Quảng Ninh', 'Bình Thuận', 'Cà Mau'],
    answer: 'Khánh Hòa',
    timeLimit: 12,
  },
  {
    id: 2,
    question: 'Hành tinh nào trong Hệ Mặt Trời có thời gian tự quay một vòng quanh trục lâu hơn thời gian quay quanh Mặt Trời?',
    options: ['Sao Kim', 'Sao Thủy', 'Sao Hỏa', 'Sao Mộc'],
    answer: 'Sao Kim (Kim tinh)',
    timeLimit: 12,
  },
  {
    id: 3,
    question: 'Trong tác phẩm "Truyện Kiều" của Nguyễn Du, nàng Kiều mang họ gì?',
    options: ['Vương', 'Nguyễn', 'Trần', 'Lê'],
    answer: 'Vương (Vương Thúy Kiều)',
    timeLimit: 10,
  },
  {
    id: 4,
    question: 'Nguyên tố hóa học nào có ký hiệu là "W" trong bảng tuần hoàn Mendeleev?',
    options: ['Wolfram (Tungsten)', 'Vàng', 'Bạch kim', 'Chì'],
    answer: 'Wolfram (Tungsten)',
    timeLimit: 12,
  },
  {
    id: 5,
    question: 'Vịnh biển nào của Việt Nam được UNESCO hai lần công nhận là Di sản Thiên nhiên Thế giới (1994 và 2000)?',
    options: ['Vịnh Hạ Long', 'Vịnh Nha Trang', 'Vịnh Lăng Cô', 'Vịnh Xuân Đài'],
    answer: 'Vịnh Hạ Long',
    timeLimit: 10,
  },
  {
    id: 6,
    question: 'Cầu thủ bóng đá nào là người đầu tiên và duy nhất trong lịch sử từng 3 lần vô địch World Cup?',
    options: ['Pelé', 'Diego Maradona', 'Lionel Messi', 'Zinedine Zidane'],
    answer: 'Pelé',
    timeLimit: 10,
  },
  {
    id: 7,
    question: 'Loại hạt cơ bản nào mang điện tích âm và quay xung quanh hạt nhân nguyên tử?',
    options: ['Electron', 'Proton', 'Neutron', 'Positron'],
    answer: 'Electron',
    timeLimit: 10,
  },
  {
    id: 8,
    question: 'Trận đánh nào được coi là đỉnh cao của Chiến dịch Hồ Chí Minh lịch sử, giải phóng hoàn toàn miền Nam năm 1975?',
    options: ['Tiến công Dinh Độc Lập', 'Chiến dịch Tây Nguyên', 'Chiến dịch Huế - Đà Nẵng', 'Trận Xuân Lộc'],
    answer: 'Tiến công Dinh Độc Lập (30/4/1975)',
    timeLimit: 12,
  },
  {
    id: 9,
    question: 'Tập hợp các số nguyên trong toán học thường được ký hiệu bằng chữ cái in hoa nào?',
    options: ['Z', 'N', 'R', 'Q'],
    answer: 'Z',
    timeLimit: 10,
  },
  {
    id: 10,
    question: 'Đỉnh núi Fansipan – nóc nhà của Đông Dương thuộc dãy núi nào ở Việt Nam?',
    options: ['Hoàng Liên Sơn', 'Trường Sơn Bắc', 'Trường Sơn Nam', 'Bạch Mã'],
    answer: 'Hoàng Liên Sơn',
    timeLimit: 12,
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
      rowLabel: 'Gợi ý 1 (Hàng ngang 1 - 7 chữ cái)',
      question: 'Thời kỳ các vua nào trong truyền thuyết được coi là đã sáng lập nên nhà nước Văn Lang cổ đại?',
      answer: 'HÙNG VƯƠNG',
      isRevealed: false,
      timeLimit: 15,
    },
    {
      id: 2,
      rowLabel: 'Gợi ý 2 (Hàng ngang 2 - 8 chữ cái)',
      question: 'Kim loại chủ đạo được cư dân Việt cổ sử dụng để đúc ra các nhạc khí và vũ khí thời đồ đồng là gì?',
      answer: 'ĐỒNG THAU',
      isRevealed: false,
      timeLimit: 15,
    },
    {
      id: 3,
      rowLabel: 'Gợi ý 3 (Hàng ngang 3 - 6 chữ cái)',
      question: 'Hình tượng loài chim sải cánh bay được khắc họa rất nhiều trên mặt trống đồng cổ đại là chim gì?',
      answer: 'CHIM LẠC',
      isRevealed: false,
      timeLimit: 15,
    },
    {
      id: 4,
      rowLabel: 'Gợi ý 4 (Hàng ngang 4 - 8 chữ cái)',
      question: 'Hình tượng ngôi sao nhiều cánh ở chính giữa mặt trống đồng tượng trưng cho điều gì trong tín ngưỡng sơ khai?',
      answer: 'MẶT TRỜI',
      isRevealed: false,
      timeLimit: 15,
    },
  ],
};

import type { ObstacleData, Round1Question, Team } from "../types/game";

export const INITIAL_TEAMS: Team[] = [
  {
    id: "team-1",
    name: "NHÓM 1",
    score: 0,
    canGuessObstacle: true,
    color: "#3B82F6", // Blue
  },
  {
    id: "team-2",
    name: "NHÓM 3",
    score: 0,
    canGuessObstacle: true,
    color: "#EAB308", // Gold / Amber
  },
  {
    id: "team-3",
    name: "NHÓM 4",
    score: 0,
    canGuessObstacle: true,
    color: "#EF4444", // Red
  },
  {
    id: "team-4",
    name: "NHÓM 5",
    score: 0,
    canGuessObstacle: true,
    color: "#10B981", // Emerald
  },
  {
    id: "team-5",
    name: "NHÓM 6",
    score: 0,
    canGuessObstacle: true,
    color: "#8B5CF6", // Purple
  },
  {
    id: "team-6",
    name: "NHÓM 7",
    score: 0,
    canGuessObstacle: true,
    color: "#06B6D4", // Cyan
  },
];

export const MOCK_ROUND1_QUESTIONS: Round1Question[] = [
  {
    id: 1,
    question:
      "Theo tư tưởng Hồ Chí Minh, mục đích của đoàn kết quốc tế là gì?",
    options: [
      "Chỉ tranh thủ sự hỗ trợ về kinh tế từ các nước",
      "Kết hợp sức mạnh dân tộc với sức mạnh thời đại, tạo sức mạnh tổng hợp cho cách mạng",
      "Phụ thuộc vào sự giúp đỡ của các nước khác",
      "Thay thế hoàn toàn sức mạnh dân tộc bằng sức mạnh quốc tế",
    ],
    answer:
      "Kết hợp sức mạnh dân tộc với sức mạnh thời đại, tạo sức mạnh tổng hợp cho cách mạng",
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      "Chương V, Mục II.1: Đoàn kết quốc tế nhằm kết hợp sức mạnh dân tộc với sức mạnh thời đại, tạo nên sức mạnh tổng hợp to lớn để giải phóng dân tộc và xây dựng đất nước.",
  },
  {
    id: 2,
    question:
      "Theo tư tưởng Hồ Chí Minh, muốn tranh thủ sự giúp đỡ và ủng hộ quốc tế thì trước hết dân tộc ta phải dựa vào yếu tố nào?",
    options: [
      "Sự giúp đỡ trực tiếp từ các nước lớn",
      "Thực lực và tinh thần tự lực cánh sinh của dân tộc",
      "Các bản hiệp định và cam kết ngoại giao",
      "Sự bảo hộ của các tổ chức quốc tế",
    ],
    answer: "Thực lực và tinh thần tự lực cánh sinh của dân tộc",
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      'Chương V, Mục II.3b (Đoàn kết trên cơ sở độc lập, tự chủ - tr.193-197): "Muốn người ta giúp cho, thì trước hết mình phải tự giúp lấy mình đã", "Tự lực cánh sinh là chính".',
  },
  {
    id: 3,
    question:
      'Trong quan điểm về nguyên tắc "Đoàn kết trên cơ sở độc lập, tự chủ", Chủ tịch Hồ Chí Minh đã sử dụng hình ảnh so sánh nào để nhấn mạnh mối quan hệ giữa thực lực nội tại và hoạt động ngoại giao?',
    options: [
      '"Thực lực là cái gốc, ngoại giao là cái ngọn"',
      '"Thực lực là cái chiêng, ngoại giao là cái tiếng"',
      '"Thực lực là cái thuyền, ngoại giao là cái lái"',
      '"Thực lực là ngôi nhà, ngoại giao là cánh cửa"',
    ],
    answer: '"Thực lực là cái chiêng, ngoại giao là cái tiếng"',
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      'Chương V, Mục II.3b (Đoàn kết trên cơ sở độc lập, tự chủ - tr.193-197): "Trong quan hệ quốc tế, Người nhấn mạnh: phải có thực lực, thực lực là cái chiêng, ngoại giao là cái tiếng, chiêng có to tiếng mới lớn..."',
  },
  {
    id: 4,
    question:
      "Theo tư tưởng Hồ Chí Minh về sự cần thiết phải đoàn kết quốc tế, sức mạnh thời đại bao gồm những yếu tố cốt lõi nào?",
    options: [
      "Sức mạnh của chủ nghĩa yêu nước và tinh thần tự lực, tự cường dân tộc",
      "Sức mạnh của phong trào cách mạng thế giới và sức mạnh của chủ nghĩa Mác - Lênin",
      "Sức mạnh của khối liên minh công - nông - trí thức dưới sự lãnh đạo của Đảng",
      "Sức mạnh của truyền thống đoàn kết toàn dân và tinh thần bất khuất chống ngoại xâm",
    ],
    answer:
      "Sức mạnh của phong trào cách mạng thế giới và sức mạnh của chủ nghĩa Mác - Lênin",
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      'Chương V, Mục II.1 (Sự cần thiết phải đoàn kết quốc tế - tr.184-188): "Sức mạnh thời đại là sức mạnh của phong trào cách mạng thế giới, đó còn là sức mạnh của chủ nghĩa Mác - Lênin được xác lập bằng thắng lợi của Cách mạng Tháng Mười Nga năm 1917."',
  },
  {
    id: 5,
    question:
      'Khái niệm "các nước dân chủ" trong chính sách đối ngoại "Làm bạn với tất cả mọi nước dân chủ..." của Hồ Chí Minh được hiểu là gì?',
    options: [
      "Chỉ bao gồm các nước theo chế độ xã hội chủ nghĩa",
      "Tất cả các quốc gia tôn trọng độc lập, chủ quyền và bình đẳng với Việt Nam",
      "Các nước tư bản phát triển có nền kinh tế lâu đời",
      "Các quốc gia nằm trong khu vực Đông Nam Á",
    ],
    answer:
      "Tất cả các quốc gia tôn trọng độc lập, chủ quyền và bình đẳng với Việt Nam",
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      'Chương V, Mục II.3a (Đoàn kết trên cơ sở thống nhất mục tiêu và lợi ích - tr.193-197): "Các nước dân chủ" bao gồm tất cả các nước tôn trọng độc lập, tự chủ và quyền dân tộc cơ bản của Việt Nam, không phân biệt chế độ chính trị.',
  },
  {
    id: 6,
    question:
      'Qua câu nói “Thực lực là cái chiêng, ngoại giao là cái tiếng, chiêng có to tiếng mới lớn”, Hồ Chí Minh muốn nhấn mạnh điều gì?',
    options: [
      "Ngoại giao cần được ưu tiên nhằm mở rộng quan hệ với các lực lượng quốc tế",
      "Phải có thực lực làm nền tảng cho hoạt động đối ngoại",
      "Đoàn kết quốc tế cần được tăng cường để bổ sung cho những hạn chế về thực lực",
      "Hoạt động ngoại giao cần được kết hợp với sự hỗ trợ của các lực lượng quốc tế",
    ],
    answer: "Phải có thực lực làm nền tảng cho hoạt động đối ngoại",
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      "Chương V, Mục II.3b: Thực lực là sức mạnh vật chất và tinh thần nội tại của đất nước. Thực lực mạnh thì tiếng nói ngoại giao trên trường quốc tế mới có trọng lượng và uy tín.",
  },
  {
    id: 7,
    question:
      'Theo Hồ Chí Minh, “sức mạnh thời đại” chủ yếu được hiểu là:',
    options: [
      "Sức mạnh kinh tế của các nước phát triển",
      "Sức mạnh quân sự của các cường quốc",
      "Sức mạnh của phong trào cách mạng thế giới và chủ nghĩa Mác - Lênin",
      "Sức mạnh của khoa học và công nghệ hiện đại",
    ],
    answer:
      "Sức mạnh của phong trào cách mạng thế giới và chủ nghĩa Mác - Lênin",
    correctOptionIndex: 2,
    timeLimit: 10,
    explanation:
      "Chương V, Mục II.1: Sức mạnh thời đại là sự hội tụ của ba dòng thác cách mạng thế giới và ánh sáng soi đường của chủ nghĩa Mác - Lênin.",
  },
  {
    id: 8,
    question:
      "Tư tưởng đoàn kết vì thắng lợi của cách mạng Việt Nam đã định hướng cho việc hình thành mấy tầng mặt trận đoàn kết quốc tế?",
    options: [
      "2 tầng mặt trận",
      "3 tầng mặt trận",
      "4 tầng mặt trận",
      "5 tầng mặt trận",
    ],
    answer: "4 tầng mặt trận",
    correctOptionIndex: 2,
    timeLimit: 10,
    explanation:
      "Chương V, Mục II.2 (Lực lượng đoàn kết quốc tế và hình thức tổ chức - tr.188-193): Định hình 4 tầng mặt trận: (1) Mặt trận đại đoàn kết dân tộc Việt Nam; (2) Mặt trận đoàn kết Việt Nam - Lào - Campuchia; (3) Mặt trận nhân dân Á - Phi đoàn kết với Việt Nam; (4) Mặt trận nhân dân thế giới đoàn kết với Việt Nam chống đế quốc xâm lược.",
  },
  {
    id: 9,
    question:
      "Theo tư tưởng Hồ Chí Minh, đoàn kết quốc tế phải gắn với nguyên tắc độc lập, tự chủ vì lý do nào sau đây?",
    options: [
      "Vì sức mạnh dân tộc cần được phát huy trước khi tranh thủ sự hỗ trợ quốc tế",
      "Vì quan hệ quốc tế cần được mở rộng nhưng phải hạn chế sự phụ thuộc bên ngoài",
      "Vì đoàn kết quốc tế phải dựa trên nội lực, giữ vững quyền tự quyết của dân tộc",
      "Vì hoạt động đối ngoại cần được thực hiện chủ yếu bằng sức mạnh của dân tộc",
    ],
    answer:
      "Vì đoàn kết quốc tế phải dựa trên nội lực, giữ vững quyền tự quyết của dân tộc",
    correctOptionIndex: 2,
    timeLimit: 10,
    explanation:
      "Chương V, Mục II.3b: Đoàn kết quốc tế là để tăng thêm sức mạnh nhưng phải luôn giữ vững độc lập, tự chủ, không dựa dẫm, ỷ lại hay để mất quyền tự quyết vận mệnh dân tộc.",
  },
  {
    id: 10,
    question:
      'Hồ Chí Minh tuyên bố chính sách đối ngoại “Làm bạn với tất cả mọi nước dân chủ và không gây thù oán với một ai” vào thời điểm nào?',
    options: [
      "Tháng 9/1946",
      "Tháng 9/1947",
      "Tháng 9/1948",
      "Tháng 9/1949",
    ],
    answer: "Tháng 9/1947",
    correctOptionIndex: 1,
    timeLimit: 10,
    explanation:
      "Chương V, Mục II.3a: Vào tháng 9/1947, Chủ tịch Hồ Chí Minh khẳng định chính sách đối ngoại rộng mở, độc lập tự chủ của nước Việt Nam Dân chủ Cộng hòa.",
  },
];

export const MOCK_OBSTACLE_DATA: ObstacleData = {
  keyword: "ĐOÀN KẾT QUỐC TẾ",
  description:
    "Tư tưởng cốt lõi của Chủ tịch Hồ Chí Minh: Kết hợp sức mạnh dân tộc với sức mạnh thời đại, đoàn kết quốc tế vì hòa bình, hữu nghị, hợp tác và tiến bộ xã hội.",
  imageUrl: "/round2_visual_clue.png",
  isFullyRevealed: false,
  clues: [
    {
      id: 1,
      rowLabel: "Hàng ngang 1 (7 chữ cái)",
      question:
        "Hình ảnh chim câu trắng tha cành ô liu là biểu tượng quen thuộc trên toàn thế giới tượng trưng cho trạng thái nào?",
      answer: "HÒA BÌNH",
      explanation: "Biểu tượng toàn cầu",
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 2,
      rowLabel: "Hàng ngang 2 (6 chữ cái)",
      question:
        'Trong mô hình kinh tế tập thể ở Việt Nam, từ nào còn thiếu trong tên gọi của hình thức tổ chức sản xuất do các hộ gia đình/cá nhân cùng góp vốn và chung sức thành lập: "...... xã"?',
      answer: "HỢP TÁC",
      explanation: "Kinh tế / Đời sống (Hợp tác xã)",
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 3,
      rowLabel: "Hàng ngang 3 (6 chữ cái)",
      question:
        'Cụm từ chỉ các giá trị văn hóa cốt lõi của dân tộc mà Việt Nam kiên quyết giữ vững, tuyệt đối không "hòa tan" hay đánh đổi khi mở rộng quan hệ đối ngoại?',
      answer: "BẢN SẮC",
      explanation:
        "Điểm tựa vững chắc giúp Việt Nam hội nhập sâu rộng mà không mất đi bản lĩnh dân tộc.",
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 4,
      rowLabel: "Hàng ngang 4 (7 chữ cái)",
      question:
        "Từ nào gồm 7 chữ cái dùng để chỉ một khoảng thời gian lịch sử rất dài gắn liền với một giai đoạn phát triển lớn của nhân loại?",
      answer: "THỜI ĐẠI",
      explanation: "Lịch sử / Khoa học",
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 5,
      rowLabel: "Hàng ngang 5 (7 chữ cái)",
      question:
        '"Ngôi nhà chung" của nhân loại — nơi các quốc gia cùng chung tay giải quyết những thách thức toàn cầu như biến đổi khí hậu, dịch bệnh và bảo vệ môi trường?',
      answer: "TRÁI ĐẤT",
      explanation:
        "Thể hiện tinh thần trách nhiệm toàn cầu của trí thức trẻ và sinh viên Việt Nam hiện nay.",
      isRevealed: false,
      timeLimit: 20,
    },
    {
      id: 6,
      rowLabel: "Hàng ngang 6 (5 chữ cái)",
      question:
        "Tên viết tắt quốc tế của Hiệp hội các quốc gia Đông Nam Á — tổ chức khu vực mà Việt Nam là một thành viên chủ động, tích cực và có trách nhiệm?",
      answer: "ASEAN",
      explanation:
        "Môi trường thực tiễn gần gũi nhất để thanh niên và trí thức trẻ Việt Nam thể hiện năng lực hội nhập.",
      isRevealed: false,
      timeLimit: 20,
    },
  ],
};

export function getCorrectOptionIndex(
  q?: Partial<Round1Question> | null,
): number {
  if (!q) return 0;
  if (typeof q.correctOptionIndex === "number" && q.correctOptionIndex >= 0) {
    return q.correctOptionIndex;
  }
  // Lookup in MOCK_ROUND1_QUESTIONS by ID
  const mockQ = MOCK_ROUND1_QUESTIONS.find((m) => m.id === q.id);
  if (mockQ && typeof mockQ.correctOptionIndex === "number") {
    return mockQ.correctOptionIndex;
  }
  // Lookup by matching answer string in options
  if (q.options && q.answer) {
    const cleanAnswer = q.answer.toLowerCase();
    const idx = q.options.findIndex((opt) => {
      const cleanOpt = opt.toLowerCase();
      return cleanAnswer.includes(cleanOpt) || cleanOpt.includes(cleanAnswer);
    });
    if (idx !== -1) return idx;
  }
  return 0;
}

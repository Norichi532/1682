'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const t = new Date();

    // ─── Tour products (id 10–17) ───────────────────────────────────────────
    await queryInterface.bulkInsert('products', [
      // ── 1 NGÀY ─────────────────────────────────────────────────────────────
      {
        id: 10, category_id: 2,
        product_name: 'Tour Đà Nẵng City 1 Ngày',
        description: 'Khám phá thành phố Đà Nẵng trong 1 ngày: Chùa Linh Ứng Sơn Trà, Cầu Tình Yêu, Công viên Apec, Viện Cổ Chàm và Ngũ Hành Sơn.',
        address: 'Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Đà Nẵng City Tour',
            items: [
              { time: '07h30', desc: 'Xe và hướng dẫn viên đón khách tại khách sạn, khởi hành tham quan TP Đà Nẵng.' },
              { time: '08h00', desc: 'Tham quan Chùa Linh Ứng bán đảo Sơn Trà, nơi có tượng Phật Quan Âm cao 67m.' },
              { time: '09h30', desc: 'Check in Cầu Tình Yêu, tham quan cầu Rồng, ngắm toàn bộ thành phố Đà Nẵng bên dòng Sông Hàn.' },
              { time: '10h30', desc: 'Tham quan Công viên Apec với biểu tượng hình cánh diều và nhà trưng bày.' },
              { time: '11h30', desc: 'Viện Cổ Chàm — chứng tích lịch sử với cổ vật từ nền văn hóa Sa Huỳnh và đế quốc Chăm Pa.' },
              { time: '12h30', desc: 'Dùng bữa trưa tại nhà hàng: Mỳ Quảng, Bánh Tráng Cuốn Thịt Heo.' },
              { time: '13h30', desc: 'Khởi hành đến Ngũ Hành Sơn. HDV giới thiệu lịch sử kháng chiến tại Đà Nẵng.' },
              { time: '14h00', desc: 'Tham quan làng đá mỹ nghệ Non Nước với các tác phẩm điêu khắc tinh xảo.' },
              { time: '14h20', desc: 'Thượng sơn tham quan các ngọn Thượng Thai, Trung Thai, Hạ Thai. Khám phá hang động, viếng chùa Linh Ứng cổ nhất Đà Nẵng.' },
              { time: '16h15', desc: 'Xe đưa đoàn về điểm đón ban đầu. Kết thúc tour.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },
      {
        id: 11, category_id: 2,
        product_name: 'Tour Đà Nẵng – Hội An 1 Ngày',
        description: 'Buổi chiều tham quan Chùa Linh Ứng, Ngũ Hành Sơn; buổi tối dạo phố cổ Hội An, thả đèn hoa đăng trên sông Hoài.',
        address: 'Đà Nẵng → Hội An',
        image_url: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Đà Nẵng & Hội An',
            items: [
              { time: '13h30', desc: 'Xe và HDV đón du khách tại điểm hẹn, khởi hành đi Chùa Linh Ứng Sơn Trà.' },
              { time: '14h00', desc: 'Tham quan Chùa Linh Ứng lớn nhất Đà Nẵng, chiêm ngưỡng tượng Phật bà Quan Âm lớn nhất Việt Nam.' },
              { time: '15h30', desc: 'Tham quan danh thắng Ngũ Hành Sơn.' },
              { time: '16h00', desc: 'Viếng chùa Linh Ứng Non Nước, chùa Tam Thai, khám phá động Huyền Không, động Tàng Chơn.' },
              { time: '17h00', desc: 'Tham quan làng đá mỹ nghệ Non Nước hơn 300 năm tuổi.' },
              { time: '17h30', desc: 'Xe đưa đoàn đến Hội An — Di sản văn hóa thế giới.' },
              { time: '18h00', desc: 'Bách bộ tham quan phố cổ, khám phá Chùa Cầu — biểu tượng của Hội An.' },
              { time: '18h30', desc: 'Dừng chân ăn tối tại nhà hàng nổi tiếng Hội An.' },
              { time: '19h00', desc: 'Tham quan nhà cổ Tấn Ký, hội quán Quảng Đông, dạo phố đèn lồng, mua sắm chợ đêm.' },
              { time: '20h00', desc: 'Xem hát bài chòi, thả đèn hoa đăng trên sông Hoài (chi phí tự túc).' },
              { time: '21h00', desc: 'Lên xe về lại Đà Nẵng. Kết thúc tour.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },
      {
        id: 12, category_id: 2,
        product_name: 'Tour Đà Nẵng – Bà Nà Hills 1 Ngày',
        description: 'Trọn ngày khám phá Bà Nà Hills: Vườn hoa Le Jardin, Cầu Vàng, Lâu Đài Mặt Trăng, Làng Pháp và Fantasy Park.',
        address: 'Bà Nà Hills, Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Bà Nà Hills',
            items: [
              { time: '07h30', desc: 'Xe và HDV đón khách tại điểm hẹn nội thành Đà Nẵng, khởi hành đi Bà Nà Hills.' },
              { time: '08h30', desc: 'Đến cổng khu du lịch. HDV làm thủ tục nhận vé, đưa du khách lên cáp treo.' },
              { time: '08h45', desc: 'Ngồi cáp treo, chiêm ngưỡng cánh rừng nguyên sinh và cảm nhận sự thay đổi của thời tiết.' },
              { time: '09h15', desc: 'Tham quan Vườn hoa Le Jardin D\'Amour với các loài hoa trên thế giới.' },
              { time: '09h45', desc: 'Khám phá Cầu Vàng ở độ cao 1.400m, được nâng đỡ bởi đôi bàn tay rêu phong khổng lồ.' },
              { time: '10h15', desc: 'Viếng thăm Chùa Linh Ứng trên đỉnh Núi Chúa.' },
              { time: '10h45', desc: 'Đi tàu hỏa leo núi số 2, tham quan Lâu Đài Mặt Trăng, thưởng thức show nghệ thuật.' },
              { time: '11h15', desc: 'Bách bộ từ Lâu Đài Mặt Trăng sang Quảng Trường Nhật Thực, chụp ảnh và săn mây.' },
              { time: '11h45', desc: 'Buffet tại nhà hàng 5 sao lớn nhất Bà Nà Hills (gần 200 món Á – Âu).' },
              { time: '13h00', desc: 'Tham quan Làng Pháp cổ kính lãng mạn.' },
              { time: '13h30', desc: 'Trải nghiệm Fantasy Park — khu vui chơi trong nhà lớn nhất Việt Nam.' },
              { time: '15h00', desc: 'Tự do tham quan, ngắm cảnh và chụp hình kỷ niệm tại Bà Nà Hills.' },
              { time: '15h30', desc: 'Tập trung lên cabin di chuyển xuống núi. Xe đưa du khách về Đà Nẵng.' },
              { time: '17h00', desc: 'Trả du khách về điểm hẹn ban đầu. Chào tạm biệt!' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },
      {
        id: 13, category_id: 2,
        product_name: 'Tour Núi Thần Tài 1 Ngày',
        description: 'Trải nghiệm công viên nước, tắm suối khoáng nóng tự nhiên, hồ luộc trứng và công viên khủng long tại Núi Thần Tài.',
        address: 'Núi Thần Tài, Đà Nẵng',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        num_days: 1,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Núi Thần Tài',
            items: [
              { time: '07h30', desc: 'Xe và HDV đón khách, khởi hành đến Công viên suối khoáng nóng Núi Thần Tài.' },
              { time: '08h30', desc: 'Đến cổng khu du lịch, gửi tư trang, bắt đầu khám phá.' },
              { time: '08h45', desc: 'Xe điện đưa đoàn đến công viên nước, tham gia trò chơi massage tia nước, đường trượt nước.' },
              { time: '10h00', desc: 'Trải nghiệm sông Lười, khám phá động Long Tiên, thư giãn massage tại hồ Ficus.' },
              { time: '11h00', desc: 'Ngâm mình tắm khoáng nóng tự nhiên tốt cho sức khỏe.' },
              { time: '12h00', desc: 'Ăn trưa và nghỉ ngơi tại nhà hàng Rồng Đỏ.' },
              { time: '13h00', desc: 'Tham quan hồ luộc trứng tự nhiên, trải nghiệm độc đáo chỉ có tại Núi Thần Tài (chi phí tự túc).' },
              { time: '13h30', desc: 'Công viên khủng long — nhiều khủng long có thể chuyển động và phát ra âm thanh thú vị.' },
              { time: '14h00', desc: 'Tham quan miếu Sơn Thần, tượng Di Lặc, tượng Long Quy, bồn tắm đá tự nhiên lớn nhất Việt Nam.' },
              { time: '15h30', desc: 'Tập trung rời khu du lịch. Kết thúc tour Núi Thần Tài 1 ngày.' },
              { time: '16h30', desc: 'Xe về Đà Nẵng, trả khách tại điểm hẹn. Chào tạm biệt!' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },

      // ── 2 NGÀY 1 ĐÊM ───────────────────────────────────────────────────────
      {
        id: 14, category_id: 2,
        product_name: 'Tour Đà Nẵng – Hội An – Bà Nà Hills 2N1Đ',
        description: 'Ngày 1: Sơn Trà, Ngũ Hành Sơn, phố cổ Hội An về đêm. Ngày 2: Bà Nà Hills – Cầu Vàng – Fantasy Park.',
        address: 'Đà Nẵng → Hội An → Bà Nà Hills',
        image_url: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Sơn Trà & Ngũ Hành Sơn & Hội An',
            items: [
              { time: '11h00', desc: 'Xe đón du khách tại sân bay, đưa đi ăn trưa (tự túc), về khách sạn nhận phòng.' },
              { time: '13h30', desc: 'Tham quan Chùa Linh Ứng Sơn Trà, ngắm thành phố Đà Nẵng từ trên cao.' },
              { time: '15h00', desc: 'Đến Ngũ Hành Sơn, chinh phục 108 bậc cấp ngọn Thủy Sơn, tham quan Chùa Linh Ứng.' },
              { time: '16h00', desc: 'Tham quan Tháp Xá Lợi, Vọng Hải Đài, chùa Tam Thai, động Tàng Chơn, Động Huyền Không.' },
              { time: '17h00', desc: 'Bách bộ làng đá mỹ nghệ Non Nước gần 300 năm tuổi.' },
              { time: '17h30', desc: 'Lên xe vào phố cổ Hội An.' },
              { time: '18h00', desc: 'Dùng cơm tối tại nhà hàng trong phố cổ.' },
              { time: '19h00', desc: 'Tham quan Chùa Cầu, Hội Quán Phúc Kiến, Nhà cổ Tấn Ký, dạo phố đèn lồng.' },
              { time: '20h00', desc: 'Tự do hát bài chòi, thả đèn hoa đăng sông Hoài, mua sắm chợ đêm (tự túc).' },
              { time: '20h30', desc: 'Đoàn tập trung lên xe về lại Đà Nẵng. Kết thúc lịch trình ngày thứ nhất.' },
              { time: '21h00', desc: 'Lên xe về Đà Nẵng, nghỉ đêm tại khách sạn.' }
            ]
          },
          {
            day: 2, label: 'Ngày 2 — Bà Nà Hills',
            items: [
              { time: '07h00', desc: 'Ăn sáng tại khách sạn. Xe và HDV đón đoàn khởi hành đi Bà Nà Hills.' },
              { time: '08h45', desc: 'HDV làm thủ tục nhận vé. Du khách đi cáp treo lên núi, ngắm rừng nguyên sinh.' },
              { time: '09h00', desc: 'Đi tàu hỏa leo núi tham quan Vườn hoa Tình Yêu, Chùa Linh Ứng Bà Nà.' },
              { time: '10h00', desc: 'Chiêm ngưỡng Cầu Vàng ở độ cao 1.400m.' },
              { time: '10h30', desc: 'Tham quan Lâu Đài Mặt Trăng và Quảng trường Nhật Thực.' },
              { time: '12h00', desc: 'Buffet trưa tại nhà hàng 4 sao trên đỉnh núi Chúa.' },
              { time: '13h30', desc: 'Bách bộ tham quan Làng Pháp cổ kính mang nét đẹp châu Âu thế kỷ 19.' },
              { time: '14h00', desc: 'Trải nghiệm Fantasy Park với hơn 100 trò chơi cho cả người lớn và trẻ em.' },
              { time: '16h00', desc: 'Lên cáp xuống núi. Xe đưa du khách ra sân bay. Kết thúc tour 2 ngày 1 đêm.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },
      {
        id: 15, category_id: 2,
        product_name: 'Tour Đà Nẵng – Hội An – Núi Thần Tài 2N1Đ',
        description: 'Ngày 1: Sơn Trà, Ngũ Hành Sơn, phố cổ Hội An. Ngày 2: Tắm khoáng nóng và khám phá Núi Thần Tài.',
        address: 'Đà Nẵng → Hội An → Núi Thần Tài',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Sơn Trà & Ngũ Hành Sơn & Hội An',
            items: [
              { time: '11h00', desc: 'Xe đón du khách tại sân bay, về khách sạn nhận phòng.' },
              { time: '13h30', desc: 'Tham quan Chùa Linh Ứng Sơn Trà.' },
              { time: '15h00', desc: 'Đến Ngũ Hành Sơn, chinh phục 108 bậc cấp ngọn Thủy Sơn.' },
              { time: '16h00', desc: 'Tham quan Tháp Xá Lợi, chùa Tam Thai, động Tàng Chơn, Động Huyền Không.' },
              { time: '17h00', desc: 'Tham quan làng đá mỹ nghệ Non Nước.' },
              { time: '17h30', desc: 'Lên xe vào phố cổ Hội An.' },
              { time: '18h00', desc: 'Dùng cơm tối tại nhà hàng, thưởng thức đặc sản Hội An.' },
              { time: '19h00', desc: 'Tham quan Chùa Cầu, Hội Quán Phúc Kiến, dạo phố đèn lồng.' },
              { time: '20h00', desc: 'Tự do nghe hát bài chòi, thả đèn hoa đăng sông Hoài, mua sắm chợ đêm Nguyễn Hoàng (chi phí tự túc).' },
              { time: '20h30', desc: 'Đoàn tập trung lên xe về lại Đà Nẵng. Kết thúc lịch trình ngày thứ nhất.' },
              { time: '21h00', desc: 'Lên xe về Đà Nẵng, nghỉ đêm tại khách sạn.' }
            ]
          },
          {
            day: 2, label: 'Ngày 2 — Núi Thần Tài',
            items: [
              { time: '08h00', desc: 'Ăn sáng tại khách sạn. Xe đón du khách đi Núi Thần Tài.' },
              { time: '09h00', desc: 'Đến cổng khu du lịch, gửi hành lý, xe điện đưa đoàn tới khu vực hồ bơi.' },
              { time: '10h00', desc: 'Trải nghiệm công viên nước, các trò chơi cảm giác mạnh.' },
              { time: '11h30', desc: 'Buffet trưa tại nhà hàng Rồng Đỏ.' },
              { time: '13h30', desc: 'Tắm khoáng nước nóng tự nhiên, ngâm mình thư giãn.' },
              { time: '14h30', desc: 'Tham quan công viên khủng long, đền Di Lặc, miếu Sơn Thần, hồ luộc trứng.' },
              { time: '16h00', desc: 'Lên xe về Đà Nẵng. Xe đưa du khách ra sân bay/nhà ga. Kết thúc tour.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },
      {
        id: 16, category_id: 2,
        product_name: 'Tour Đà Nẵng – Hội An – Cù Lao Chàm 2N1Đ',
        description: 'Ngày 1: Sơn Trà, Ngũ Hành Sơn, phố cổ Hội An. Ngày 2: Khám phá đảo Cù Lao Chàm, lặn ngắm san hô, tắm biển trong xanh.',
        address: 'Đà Nẵng → Hội An → Đảo Cù Lao Chàm',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Sơn Trà & Ngũ Hành Sơn & Hội An',
            items: [
              { time: '11h00', desc: 'Xe đón du khách tại sân bay, về khách sạn nhận phòng.' },
              { time: '13h30', desc: 'Tham quan Chùa Linh Ứng Sơn Trà.' },
              { time: '15h00', desc: 'Đến Ngũ Hành Sơn, chinh phục 108 bậc cấp ngọn Thủy Sơn.' },
              { time: '16h00', desc: 'Tham quan Tháp Xá Lợi, Vọng Hải Đài, chùa Tam Thai, động Tàng Chơn, Động Huyền Không.' },
              { time: '17h00', desc: 'Tham quan làng đá mỹ nghệ Non Nước.' },
              { time: '17h30', desc: 'Lên xe vào phố cổ Hội An.' },
              { time: '18h00', desc: 'Dùng cơm tối, thưởng thức đặc sản Hội An.' },
              { time: '19h00', desc: 'Tham quan Chùa Cầu, Hội Quán Phúc Kiến, dạo phố đèn lồng.' },
              { time: '20h00', desc: 'Tự do nghe hát bài chòi, thả đèn hoa đăng sông Hoài, mua sắm chợ đêm Nguyễn Hoàng (chi phí tự túc).' },
              { time: '20h30', desc: 'Đoàn tập trung lên xe về lại Đà Nẵng. Kết thúc lịch trình ngày thứ nhất.' },
              { time: '21h00', desc: 'Lên xe về Đà Nẵng, nghỉ đêm tại khách sạn.' }
            ]
          },
          {
            day: 2, label: 'Ngày 2 — Đảo Cù Lao Chàm',
            items: [
              { time: '08h00', desc: 'Ăn sáng tại khách sạn. Xe đón đoàn khởi hành đến cảng Cửa Đại.' },
              { time: '08h45', desc: 'HDV làm thủ tục xuất bến. Đoàn lên cano ra đảo Cù Lao Chàm.' },
              { time: '09h00', desc: 'Cano cập bến Bãi Làng. Tham quan Khu bảo tồn biển, Giếng cổ Champa, chùa Hải Tạng.' },
              { time: '10h30', desc: 'Cano đến khu sinh thái Bãi Ông, thay trang phục tắm biển. Ra Hòn Dài lặn ngắm san hô.' },
              { time: '11h30', desc: 'Dùng cơm trưa tại nhà hàng với đặc sản Cù Lao Chàm.' },
              { time: '14h00', desc: 'Tự do tắm biển, chụp ảnh lưu niệm.' },
              { time: '15h00', desc: 'Cano về cảng. Xe đón trở lại Đà Nẵng, tiễn ra sân bay/nhà ga. Chào tạm biệt!' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      },
      {
        id: 17, category_id: 2,
        product_name: 'Tour Đà Nẵng – Hội An – Huế 2N1Đ',
        description: 'Ngày 1: Sơn Trà, Ngũ Hành Sơn, phố cổ Hội An. Ngày 2: Cố đô Huế — Lăng Khải Định, Đại Nội, Chùa Thiên Mụ.',
        address: 'Đà Nẵng → Hội An → Huế',
        image_url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
        num_days: 2,
        itinerary: JSON.stringify([
          {
            day: 1, label: 'Ngày 1 — Sơn Trà & Ngũ Hành Sơn & Hội An',
            items: [
              { time: '11h00', desc: 'Xe đón du khách tại sân bay, về khách sạn nhận phòng.' },
              { time: '13h30', desc: 'Tham quan Chùa Linh Ứng Sơn Trà.' },
              { time: '15h00', desc: 'Đến Ngũ Hành Sơn, chinh phục 108 bậc cấp ngọn Thủy Sơn.' },
              { time: '16h00', desc: 'Tham quan Tháp Xá Lợi, Vọng Hải Đài, chùa Tam Thai, động Tàng Chơn, Động Huyền Không.' },
              { time: '17h00', desc: 'Tham quan làng đá mỹ nghệ Non Nước.' },
              { time: '17h30', desc: 'Lên xe vào phố cổ Hội An.' },
              { time: '18h00', desc: 'Dùng cơm tối, thưởng thức đặc sản Hội An.' },
              { time: '19h00', desc: 'Tham quan Chùa Cầu, Hội Quán Phúc Kiến, dạo phố đèn lồng.' },
              { time: '20h00', desc: 'Tự do nghe hát bài chòi, thả đèn hoa đăng sông Hoài, mua sắm chợ đêm Nguyễn Hoàng (chi phí tự túc).' },
              { time: '20h30', desc: 'Đoàn tập trung lên xe về lại Đà Nẵng. Kết thúc lịch trình ngày thứ nhất.' },
              { time: '21h00', desc: 'Lên xe về Đà Nẵng, nghỉ đêm tại khách sạn.' }
            ]
          },
          {
            day: 2, label: 'Ngày 2 — Cố Đô Huế',
            items: [
              { time: '07h00', desc: 'Ăn sáng tại khách sạn. Xe đón đoàn khởi hành đến cố đô Huế.' },
              { time: '09h00', desc: 'Chiêm ngưỡng vịnh Lăng Cô, tham quan khu trưng bày ngọc trai.' },
              { time: '10h00', desc: 'Tham quan Lăng Khải Định — lăng tẩm đẹp nhất và bề thế nhất triều Nguyễn.' },
              { time: '11h30', desc: 'Ăn trưa và nghỉ ngơi tại nhà hàng trong thành phố Huế.' },
              { time: '13h30', desc: 'Xe đến Đại Nội tham quan Cửa Ngọ Môn, Điện Thái Hòa, cung Diên Thọ, Kỳ Đài.' },
              { time: '15h00', desc: 'Viếng thăm Chùa Thiên Mụ với tháp Phước Duyên, ngắm sông Hương thơ mộng.' },
              { time: '16h00', desc: 'Xe đưa du khách về Đà Nẵng. Tiễn ra sân bay/ga tàu. Kết thúc tour.' }
            ]
          }
        ]),
        created_at: t, updated_at: t
      }
    ], {});

    // ─── Price lists cho các tour mới ──────────────────────────────────────
    // model_id: 2=Transit 16 chỗ, 3=County 29 chỗ, 4=Universe 45 chỗ
    const priceData = [
      // Tour 1 ngày
      { product_id: 10, model_id: 2, price: 900000 },
      { product_id: 10, model_id: 3, price: 1400000 },
      { product_id: 10, model_id: 4, price: 2200000 },
      { product_id: 11, model_id: 2, price: 1000000 },
      { product_id: 11, model_id: 3, price: 1600000 },
      { product_id: 11, model_id: 4, price: 2500000 },
      { product_id: 12, model_id: 2, price: 1100000 },
      { product_id: 12, model_id: 3, price: 1800000 },
      { product_id: 12, model_id: 4, price: 2800000 },
      { product_id: 13, model_id: 2, price: 950000 },
      { product_id: 13, model_id: 3, price: 1500000 },
      { product_id: 13, model_id: 4, price: 2300000 },
      // Tour 2 ngày 1 đêm
      { product_id: 14, model_id: 2, price: 2800000 },
      { product_id: 14, model_id: 3, price: 4500000 },
      { product_id: 14, model_id: 4, price: 6500000 },
      { product_id: 15, model_id: 2, price: 2600000 },
      { product_id: 15, model_id: 3, price: 4200000 },
      { product_id: 15, model_id: 4, price: 6200000 },
      { product_id: 16, model_id: 2, price: 2700000 },
      { product_id: 16, model_id: 3, price: 4300000 },
      { product_id: 16, model_id: 4, price: 6300000 },
      { product_id: 17, model_id: 2, price: 3200000 },
      { product_id: 17, model_id: 3, price: 5000000 },
      { product_id: 17, model_id: 4, price: 7500000 },
    ];

    await queryInterface.bulkInsert('price_lists', priceData.map(p => ({
      ...p, created_at: t, updated_at: t
    })), {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('price_lists', {
      product_id: [10, 11, 12, 13, 14, 15, 16, 17]
    }, {});
    await queryInterface.bulkDelete('products', {
      id: [10, 11, 12, 13, 14, 15, 16, 17]
    }, {});
  }
};

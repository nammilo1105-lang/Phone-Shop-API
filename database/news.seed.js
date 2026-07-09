const mongoose = require("mongoose");
const newsModel = require("../src/apps/models/news.model");

const news = [
    {
        title: "iPhone 17 Pro có gì mới so với iPhone 16 Pro Max",
        slug: "iphone-17-pro-co-gi-moi-so-voi-iphone-16-pro-max",
        thumbnail: "/uploads/news/iphone-17-pro.jpg",
        shortDescription: "Những nâng cấp đáng chú ý về hiệu năng, camera và thời lượng pin trên thế hệ iPhone mới.",
        content: "iPhone 17 Pro tiếp tục tập trung vào hiệu năng xử lý, trải nghiệm camera và chất lượng màn hình. Người dùng quan tâm đến quay video, chơi game và sử dụng lâu dài sẽ thấy rõ lợi ích từ chip mới, hệ thống tản nhiệt tốt hơn và khả năng tối ưu pin. Đây là lựa chọn phù hợp cho nhóm khách hàng cần một thiết bị cao cấp dùng ổn định nhiều năm.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Samsung Galaxy S mới tập trung mạnh vào AI",
        slug: "samsung-galaxy-s-moi-tap-trung-manh-vao-ai",
        thumbnail: "/uploads/news/samsung-galaxy-ai.jpg",
        shortDescription: "Samsung đưa nhiều tính năng AI vào camera, ghi chú, dịch thuật và tìm kiếm hình ảnh.",
        content: "Dòng Galaxy S mới cho thấy định hướng rõ ràng của Samsung trong việc đưa AI vào các thao tác hằng ngày. Các tính năng như chỉnh ảnh thông minh, tóm tắt ghi chú, dịch cuộc gọi và tìm kiếm bằng hình ảnh giúp thiết bị trở nên hữu ích hơn thay vì chỉ nâng cấp cấu hình. Với người dùng Android cao cấp, đây là nhóm sản phẩm đáng cân nhắc.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Xiaomi tiếp tục gây chú ý ở phân khúc hiệu năng cao",
        slug: "xiaomi-tiep-tuc-gay-chu-y-o-phan-khuc-hieu-nang-cao",
        thumbnail: "/uploads/news/xiaomi-performance.jpg",
        shortDescription: "Xiaomi mang đến cấu hình mạnh, sạc nhanh và màn hình đẹp trong tầm giá cạnh tranh.",
        content: "Xiaomi vẫn là thương hiệu nổi bật khi nhắc đến hiệu năng trên giá bán. Các mẫu máy mới thường được trang bị chip mạnh, màn hình tần số quét cao và công nghệ sạc nhanh. Người dùng thích chơi game, xem phim và cần máy có cấu hình tốt trong ngân sách hợp lý có thể tìm thấy nhiều lựa chọn hấp dẫn từ Xiaomi.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "OPPO nâng cấp camera chân dung trên dòng Reno",
        slug: "oppo-nang-cap-camera-chan-dung-tren-dong-reno",
        thumbnail: "/uploads/news/oppo-reno-camera.jpg",
        shortDescription: "Dòng OPPO Reno mới cải thiện chụp chân dung, thiết kế mỏng nhẹ và sạc nhanh.",
        content: "OPPO Reno tiếp tục theo đuổi thế mạnh thiết kế thời trang và camera chân dung. Thuật toán xử lý ảnh mới giúp màu da tự nhiên hơn, tách nền tốt hơn và chụp thiếu sáng ổn định hơn. Đây là lựa chọn phù hợp cho người dùng thích chụp ảnh cá nhân, quay video ngắn và cần một chiếc máy nhẹ, dễ cầm.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Vivo V series chú trọng trải nghiệm selfie và quay video",
        slug: "vivo-v-series-chu-trong-trai-nghiem-selfie-va-quay-video",
        thumbnail: "/uploads/news/vivo-v-series.jpg",
        shortDescription: "Vivo tiếp tục tối ưu camera trước, chống rung và màu sắc ảnh trên dòng V series.",
        content: "Vivo V series phù hợp với nhóm người dùng ưu tiên camera trước và khả năng quay video. Các nâng cấp về chống rung, xử lý ánh sáng và thuật toán làm đẹp giúp ảnh selfie có chất lượng tốt trong nhiều điều kiện. Ngoài camera, thiết kế mỏng và màn hình sáng cũng là điểm cộng của dòng sản phẩm này.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Có nên mua điện thoại 5G trong năm 2026",
        slug: "co-nen-mua-dien-thoai-5g-trong-nam-2026",
        thumbnail: "/uploads/news/phone-5g-2026.jpg",
        shortDescription: "5G ngày càng phổ biến, nhưng người dùng vẫn nên cân nhắc nhu cầu và ngân sách.",
        content: "Điện thoại 5G đã xuất hiện ở nhiều phân khúc giá, không còn chỉ dành cho máy cao cấp. Nếu bạn thường xuyên dùng dữ liệu di động, xem video chất lượng cao hoặc cần kết nối ổn định khi di chuyển, máy 5G là lựa chọn nên ưu tiên. Tuy nhiên, người dùng chỉ dùng Wi-Fi và các tác vụ cơ bản vẫn có thể chọn máy 4G tốt để tiết kiệm chi phí.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Pin điện thoại bao nhiêu là đủ cho một ngày sử dụng",
        slug: "pin-dien-thoai-bao-nhieu-la-du-cho-mot-ngay-su-dung",
        thumbnail: "/uploads/news/smartphone-battery.jpg",
        shortDescription: "Dung lượng pin, chip xử lý và màn hình đều ảnh hưởng đến thời lượng sử dụng thực tế.",
        content: "Một chiếc điện thoại có pin từ 4500mAh đến 5000mAh thường đáp ứng tốt nhu cầu trong một ngày nếu phần mềm được tối ưu. Tuy nhiên, thời lượng pin không chỉ phụ thuộc vào con số dung lượng. Chip tiết kiệm điện, độ sáng màn hình, tần số quét và thói quen sử dụng cũng tạo ra khác biệt lớn. Người dùng chơi game nhiều nên ưu tiên máy có pin lớn và sạc nhanh.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Màn hình OLED và LCD khác nhau như thế nào",
        slug: "man-hinh-oled-va-lcd-khac-nhau-nhu-the-nao",
        thumbnail: "/uploads/news/oled-vs-lcd.jpg",
        shortDescription: "OLED cho màu đen sâu và độ tương phản cao, LCD vẫn có lợi thế về chi phí.",
        content: "Màn hình OLED hiển thị màu đen sâu hơn vì từng điểm ảnh có thể tự phát sáng và tắt độc lập. Điều này giúp độ tương phản cao, màu sắc rực rỡ và trải nghiệm xem phim tốt hơn. LCD vẫn là lựa chọn hợp lý ở phân khúc phổ thông nhờ chi phí thấp và độ bền ổn định. Khi mua điện thoại, người dùng nên cân nhắc cả độ sáng, tần số quét và độ chính xác màu.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Cách chọn điện thoại chơi game dưới 10 triệu",
        slug: "cach-chon-dien-thoai-choi-game-duoi-10-trieu",
        thumbnail: "/uploads/news/gaming-phone-under-10m.jpg",
        shortDescription: "Chip xử lý, tản nhiệt, pin và màn hình là bốn yếu tố quan trọng nhất.",
        content: "Khi chọn điện thoại chơi game dưới 10 triệu, người dùng nên ưu tiên chip xử lý mạnh và khả năng tản nhiệt ổn định. Màn hình 120Hz giúp thao tác mượt hơn, trong khi pin lớn và sạc nhanh giúp giảm thời gian chờ. Ngoài ra, dung lượng RAM và bộ nhớ trong cũng cần đủ rộng để cài nhiều tựa game nặng.",
        author: "Phone Shop",
        status: true,
    },
    {
        title: "Những lưu ý khi mua điện thoại trả góp 0%",
        slug: "nhung-luu-y-khi-mua-dien-thoai-tra-gop-0-phan-tram",
        thumbnail: "/uploads/news/installment-phone.jpg",
        shortDescription: "Trả góp 0% giúp giảm áp lực tài chính nhưng cần đọc kỹ phí và kỳ hạn thanh toán.",
        content: "Trả góp 0% là hình thức mua điện thoại phổ biến, đặc biệt với các mẫu máy cao cấp. Người dùng nên kiểm tra kỹ số tiền trả trước, kỳ hạn, phí chuyển đổi và điều kiện áp dụng. Một số chương trình yêu cầu thanh toán qua thẻ tín dụng hoặc hồ sơ tài chính. Việc đọc kỹ thông tin giúp tránh phát sinh chi phí ngoài dự kiến.",
        author: "Phone Shop",
        status: true,
    },
];

const seedNews = async () => {
    try {
        await newsModel.deleteMany({});
        await newsModel.insertMany(news);
        console.log("Seed news successfully");
    } catch (error) {
        console.error("Seed news failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

seedNews();

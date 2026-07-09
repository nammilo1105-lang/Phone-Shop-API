// const { extractMaxPrice } = require("./priceParser");

exports.parseFilters = (message) => {
  if (!message) return {};

  const text = message.toLowerCase();
  const filters = {};

  // Giá
  const pricePatterns = [
    /dưới\s+(\d+)\s*(triệu|tr|trien|million)?/i,
    /từ\s+(\d+)\s*(triệu|tr|trien|million)?/i,
    /trên\s+(\d+)\s*(triệu|tr|trien|million)?/i,
    /nhỏ hơn\s+(\d+)\s*(triệu|tr|trien|million)?/i,
    /lớn hơn\s+(\d+)\s*(triệu|tr|trien|million)?/i,
    /(\d+)\s*(triệu|tr|trien|million)?\s*(trở xuống|xuống)?/i,
    /(\d+)\s*(triệu|tr|trien|million)?\s*(trở lên|lên)?/i,
  ];

  for (const pattern of pricePatterns) {
    const match = text.match(pattern);
    if (match) {
      const price = parseInt(match[1]);
      if (text.includes("dưới") || text.includes("nhỏ hơn") || text.includes("trở xuống") || text.includes("xuống")) {
        filters.maxPrice = price * 1000000;
      } else if (text.includes("từ") || text.includes("trên") || text.includes("lớn hơn") || text.includes("trở lên") || text.includes("lên")) {
        filters.minPrice = price * 1000000;
      } else {
        filters.maxPrice = price * 1000000;
      }
      break;
    }
  }

  // RAM
  const ramPatterns = [
    /ram\s*(\d+)\s*(gb|g)?/i,
    /bộ nhớ\s*(\d+)\s*(gb|g)?/i,
    /(\d+)\s*(gb|g)\s*ram/i,
  ];

  for (const pattern of ramPatterns) {
    const match = text.match(pattern);
    if (match) {
      filters.ram = `${match[1]}GB`;
      break;
    }
  }

  // ROM
  const romPatterns = [
    /rom\s*(\d+)\s*(gb|g|tb|t)?/i,
    /bộ nhớ trong\s*(\d+)\s*(gb|g|tb|t)?/i,
    /(\d+)\s*(gb|g|tb|t)\s*rom/i,
    /(\d+)\s*(gb|g|tb|t)\s*bộ nhớ trong/i,
  ];

  for (const pattern of romPatterns) {
    const match = text.match(pattern);
    if (match) {
      const size = match[1];
      const unit = (match[2] || "GB").toUpperCase();
      filters.rom = `${size}${unit}`;
      break;
    }
  }

  // Pin
  const batteryPatterns = [
    /pin\s*(trên|lớn hơn|>)\s*(\d+)\s*(mah)?/i,
    /pin\s*(dưới|nhỏ hơn|<)\s*(\d+)\s*(mah)?/i,
    /pin\s*(\d+)\s*(mah)?/i,
    /dung lượng pin\s*(\d+)\s*(mah)?/i,
  ];

  for (const pattern of batteryPatterns) {
    const match = text.match(pattern);
    if (match) {
      const battery = match[2] || match[1];
      if (text.includes("trên") || text.includes("lớn hơn") || text.includes(">")) {
        filters.minBattery = parseInt(battery);
      } else if (text.includes("dưới") || text.includes("nhỏ hơn") || text.includes("<")) {
        filters.maxBattery = parseInt(battery);
      } else {
        filters.battery = `${battery}mAh`;
      }
      break;
    }
  }

  // Camera
  const cameraPatterns = [
    /camera\s*(\d+)\s*(mp)?/i,
    /máy ảnh\s*(\d+)\s*(mp)?/i,
    /chụp ảnh\s*(\d+)\s*(mp)?/i,
    /(\d+)\s*(mp)?\s*camera/i,
  ];

  for (const pattern of cameraPatterns) {
    const match = text.match(pattern);
    if (match) {
      filters.camera = `${match[1]}MP`;
      break;
    }
  }

  // Màn hình
  const screenPatterns = [
    /màn hình\s*(\d+\.?\d*)\s*(inch)?/i,
    /màn\s*(\d+\.?\d*)\s*(inch)?/i,
    /(\d+\.?\d*)\s*inch/i,
  ];

  for (const pattern of screenPatterns) {
    const match = text.match(pattern);
    if (match) {
      filters.screen = `${match[1]}"`;
      break;
    }
  }

  // Loại màn hình
  const screenTypePatterns = [
    /amoled/i,
    /oled/i,
    /lcd/i,
    /ips/i,
    /tft/i,
  ];

  for (const pattern of screenTypePatterns) {
    const match = text.match(pattern);
    if (match) {
      filters.screenType = match[0].toUpperCase();
      break;
    }
  }

  // Màu sắc
  const colorPatterns = [
    /màu\s*(đen|trắng|đỏ|xanh|vàng|hồng|x tím|tím|cam|xám|bạc|vàng|nâu|xanh lá|xanh dương)/i,
    /(đen|trắng|đỏ|xanh|vàng|hồng|x tím|tím|cam|xám|bạc|vàng|nâu|xanh lá|xanh dương)\s*màu/i,
  ];

  for (const pattern of colorPatterns) {
    const match = text.match(pattern);
    if (match) {
      filters.color = match[1];
      break;
    }
  }

  // Nhu cầu sử dụng
  if (text.includes("chơi game") || text.includes("gaming")) {
    filters.useCase = "gaming";
    filters.minRam = "6GB";
    filters.minBattery = 4000;
  }

  if (text.includes("pin trâu") || text.includes("pin lâu") || text.includes("pin tốt")) {
    filters.minBattery = 4500;
    filters.useCase = "battery";
  }

  if (text.includes("chụp ảnh đẹp") || text.includes("camera tốt") || text.includes("nhiếp ảnh")) {
    filters.useCase = "camera";
    filters.minCamera = "12MP";
  }

  if (text.includes("sinh viên") || text.includes("học sinh") || text.includes("giá rẻ") || text.includes("thấp")) {
    filters.maxPrice = 10000000;
    filters.useCase = "budget";
  }

  if (text.includes("văn phòng") || text.includes("công việc") || text.includes("doanh nhân")) {
    filters.useCase = "business";
    filters.minRam = "4GB";
  }

  if (text.includes("mỏng nhẹ") || text.includes("nhỏ gọn") || text.includes("thon gọn")) {
    filters.useCase = "compact";
  }

  return filters;
};

exports.buildQueryFromFilters = (filters) => {
  if (!filters || Object.keys(filters).length === 0) return {};

  const query = { status: true };

  if (filters.minPrice && filters.maxPrice) {
    query.price = { $gte: filters.minPrice, $lte: filters.maxPrice };
  } else if (filters.minPrice) {
    query.price = { $gte: filters.minPrice };
  } else if (filters.maxPrice) {
    query.price = { $lte: filters.maxPrice };
  }

  if (filters.ram) {
    query.ram = { $regex: filters.ram, $options: "i" };
  } else if (filters.minRam) {
    query.ram = { $regex: filters.minRam, $options: "i" };
  }

  if (filters.rom) {
    query.rom = { $regex: filters.rom, $options: "i" };
  }

  if (filters.battery) {
    query.battery = { $regex: filters.battery, $options: "i" };
  } else if (filters.minBattery) {
    query.battery = { $regex: new RegExp(`^${filters.minBattery}`, "i") };
  } else if (filters.maxBattery) {
    query.battery = { $regex: new RegExp(`^${filters.maxBattery}`, "i") };
  }

  if (filters.camera) {
    query.$or = [
      { cameraRear: { $regex: filters.camera, $options: "i" } },
      { cameraFront: { $regex: filters.camera, $options: "i" } },
    ];
  } else if (filters.minCamera) {
    query.$or = [
      { cameraRear: { $regex: filters.minCamera, $options: "i" } },
      { cameraFront: { $regex: filters.minCamera, $options: "i" } },
    ];
  }

  if (filters.screen) {
    query.screen = { $regex: filters.screen, $options: "i" };
  } else if (filters.screenType) {
    query.screen = { $regex: filters.screenType, $options: "i" };
  }

  if (filters.color) {
    query["colors.name"] = { $regex: filters.color, $options: "i" };
  }

  return query;
};

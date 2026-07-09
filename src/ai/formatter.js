/**
 * Format dữ liệu sản phẩm từ MongoDB thành Markdown đẹp
 */

/**
 * Format một sản phẩm thành markdown
 * @param {Object} product - Dữ liệu sản phẩm từ MongoDB
 * @returns {string} - Markdown string
 */
exports.formatProductMarkdown = (product) => {
  if (!product) return "";

  const price = product.price ? product.price.toLocaleString("vi-VN") : "Liên hệ";
  const stock = product.stock || product.quantity || 0;
  const brand = product.brand_id?.name || "";
  const category = product.category_id?.name || "";

  // Format colors
  let colorsStr = "";
  if (product.colors && product.colors.length > 0) {
    colorsStr = product.colors
      .map((c) => `• ${c.name}${c.code ? ` (${c.code})` : ""}`)
      .join("\n");
  } else {
    colorsStr = "Không có thông tin";
  }

  // Format variants
  let variantsStr = "";
  if (product.variants && product.variants.length > 0) {
    variantsStr = product.variants
      .map((v) => `• ${v.name}: ${v.price ? v.price.toLocaleString("vi-VN") + "đ" : "Liên hệ"} (Kho: ${v.stock})`)
      .join("\n");
  } else {
    variantsStr = "Không có thông tin";
  }

  return `## ${product.name || "Sản phẩm"}

**Giá:** ${price} VNĐ

**Danh mục:** ${category}

**Hãng:** ${brand}

**Tồn kho:** ${stock} sản phẩm

**Cấu hình:**
- CPU: ${product.cpu || "Không có thông tin"}
- RAM: ${product.ram || "Không có thông tin"}
- ROM: ${product.rom || "Không có thông tin"}
- Màn hình: ${product.screen || "Không có thông tin"}
- Pin: ${product.battery || "Không có thông tin"}
- Camera sau: ${product.cameraRear || "Không có thông tin"}
- Camera trước: ${product.cameraFront || "Không có thông tin"}
- Hệ điều hành: ${product.operatingSystem || "Không có thông tin"}

**Màu sắc:**
${colorsStr}

**Phiên bản:**
${variantsStr}

**Khuyến mãi:**
${product.promotion || "Không có khuyến mãi"}

**Mô tả:**
${product.description || "Không có mô tả"}`;
};

/**
 * Format danh sách sản phẩm thành bảng markdown
 * @param {Array} products - Danh sách sản phẩm
 * @returns {string} - Markdown table
 */
exports.formatProductTable = (products) => {
  if (!products || products.length === 0) {
    return "Không có sản phẩm nào.";
  }

  const header = "| Tên | Giá | RAM | ROM | Hãng |\n|------|------|-----|-----|------|";
  const rows = products
    .map((p) => {
      const price = p.price ? p.price.toLocaleString("vi-VN") : "Liên hệ";
      const brand = p.brand_id?.name || "";
      return `| ${p.name || "-"} | ${price}đ | ${p.ram || "-"} | ${p.rom || "-"} | ${brand} |`;
    })
    .join("\n");

  return `${header}\n${rows}`;
};

/**
 * Format so sánh 2 sản phẩm
 * @param {Object} product1 - Sản phẩm 1
 * @param {Object} product2 - Sản phẩm 2
 * @returns {string} - Markdown comparison table
 */
exports.formatComparison = (product1, product2) => {
  if (!product1 || !product2) {
    return "Không thể so sánh. Thiếu thông tin sản phẩm.";
  }

  const price1 = product1.price ? product1.price.toLocaleString("vi-VN") : "Liên hệ";
  const price2 = product2.price ? product2.price.toLocaleString("vi-VN") : "Liên hệ";

  return `## So sánh: ${product1.name || "Sản phẩm 1"} vs ${product2.name || "Sản phẩm 2"}

| Thông số | ${product1.name || "Sản phẩm 1"} | ${product2.name || "Sản phẩm 2"} |
|----------|------------------|------------------|
| Giá | ${price1}đ | ${price2}đ |
| RAM | ${product1.ram || "-"} | ${product2.ram || "-"} |
| ROM | ${product1.rom || "-"} | ${product2.rom || "-"} |
| CPU | ${product1.cpu || "-"} | ${product2.cpu || "-"} |
| Màn hình | ${product1.screen || "-"} | ${product2.screen || "-"} |
| Pin | ${product1.battery || "-"} | ${product2.battery || "-"} |
| Camera sau | ${product1.cameraRear || "-"} | ${product2.cameraRear || "-"} |
| Camera trước | ${product1.cameraFront || "-"} | ${product2.cameraFront || "-"} |
| Hãng | ${product1.brand_id?.name || "-"} | ${product2.brand_id?.name || "-"} |
| Tồn kho | ${product1.stock || product1.quantity || 0} | ${product2.stock || product2.quantity || 0} |`;
};

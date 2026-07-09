exports.extractKeyword = (message) => {

    const removeWords = [
        "giá",
        "bao",
        "nhiêu",
        "so",
        "sánh",
        "có",
        "không",
        "điện",
        "thoại",
        "máy",
        "xin",
        "hãy",
        "tư",
        "vấn",
        "cho",
        "mình",
        "shop",
        "là",
        "bao",
        "nào",
        "còn",
        "hàng"
    ];

    return message
        .toLowerCase()
        .replace(/[?.,!]/g, "")
        .split(/\s+/)
        .filter(w => !removeWords.includes(w))
        .join(" ");
};
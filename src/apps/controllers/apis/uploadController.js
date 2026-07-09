exports.uploadImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "File is required",
            });
        }

        const folder = req.uploadFolder || "others";
        const paths = req.files.map(file => `/uploads/${folder}/${file.filename}`);
        
        return res.status(200).json({
            status: "success",
            message: "Upload successfully",
            path: paths[0],
            paths: paths,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
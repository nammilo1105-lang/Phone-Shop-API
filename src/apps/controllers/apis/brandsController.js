const brandModel = require("../../models/brands");
exports.findAll = async (req, res) => {
  try {
    const query = {};
    if(req.query.name) query.name = req.query.name
    
    const brands = await brandModel.find(query).sort({ _id: -1 });
    return res.status(200).json({
      status: "success",
      message: "get brands successfully",
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.findById = async (req, res) => {
  try {
    const { id } = req.params;
    const brands = await brandModel.findById(id);
    return res.status(200).json({
      status: "success",
      message: "get brand successfully",
      data: brands,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.create = async (req, res) => {
  try {
    const { name, country } = req.body;
    const existBrand = await brandModel.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existBrand) {
      return res.status(400).json({
        status: "error",
        message: "Brand already exists",
      });
    }

    const brand = await brandModel.create({
      name: name.trim(),
      country: country.trim(),
    });

    return res.status(201).json({
      status: "success",
      message: "Create brand successfully",
      data: brand,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country } = req.body;

    const brand = await brandModel.findById(id);

    if (!brand) {
      return res.status(404).json({
        status: "error",
        message: "Brand not found",
      });
    }

    const existBrand = await brandModel.findOne({
      _id: { $ne: id },
      name,
    });

    if (existBrand) {
      return res.status(400).json({
        status: "error",
        message: "Brand already exists",
      });
    }

    const updatedBrand = await brandModel.findByIdAndUpdate(
      id,
      {
        name,
        country,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      status: "success",
      message: "Update brand successfully",
      data: updatedBrand,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};
exports.remove = async (req, res) => {
  try {
    const {id} = req.params;
    const brands = await brandModel.findByIdAndDelete(id);
    return res.status(200).json({
        status: "success",
        message: "delete brands successfully"
    })
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const notFound = (req,res,next) => {
    res.status(404).json({message: "service not found"})
};

module.exports = notFound;
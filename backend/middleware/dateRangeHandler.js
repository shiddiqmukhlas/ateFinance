export const calculateDateRange = (Model) => async (req, res, next) => {
    try {
        const records = await Model.find().sort({ tanggal: 1 }); // Sort by date ascending

        if (records.length === 0) {
            res.locals.oldestDate = null;
            res.locals.newestDate = null;
        } else {
            res.locals.oldestDate = records[0].tanggal.toISOString().split('T')[0]; // Format ke YYYY-MM-DD
            res.locals.newestDate = records[records.length - 1].tanggal.toISOString().split('T')[0];
        }

        next();
    } catch (error) {
        next(error); // Pass error to error handler middleware
    }
};

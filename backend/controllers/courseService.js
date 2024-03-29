const Course = require('../models/Course');

const getCourseSalesStats = async () => {
    try {
        const today = new Date();
        const oneDayAgo = new Date(today);
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const dailySales = await Course.aggregate([
            {
                $match: {
                    purchasedCount: { $gt: 0 },
                    lastUpdated: { $gte: oneDayAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$purchasedCount" }
                }
            }
        ]);

        const weeklySales = await Course.aggregate([
            {
                $match: {
                    purchasedCount: { $gt: 0 },
                    lastUpdated: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$purchasedCount" }
                }
            }
        ]);

        const monthlySales = await Course.aggregate([
            {
                $match: {
                    purchasedCount: { $gt: 0 },
                    lastUpdated: { $gte: oneMonthAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$purchasedCount" }
                }
            }
        ]);

        const yearlySales = await Course.aggregate([
            {
                $match: {
                    purchasedCount: { $gt: 0 },
                    lastUpdated: { $gte: oneYearAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$purchasedCount" }
                }
            }
        ]);

        return {
            dailySales: dailySales.length > 0 ? dailySales[0].count : 0,
            weeklySales: weeklySales.length > 0 ? weeklySales[0].count : 0,
            monthlySales: monthlySales.length > 0 ? monthlySales[0].count : 0,
            yearlySales: yearlySales.length > 0 ? yearlySales[0].count : 0
        };
    } catch (error) {
        console.error('Error fetching course sales stats:', error);
        throw error;
    }
};

module.exports = { getCourseSalesStats };

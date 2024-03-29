const Event = require('../models/Event');

const getEventRegistrationStats = async () => {
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

        const dailyRegistrations = await Event.countDocuments({
            eventDate: { $gte: oneDayAgo }
        });

        const weeklyRegistrations = await Event.countDocuments({
            eventDate: { $gte: oneWeekAgo }
        });

        const monthlyRegistrations = await Event.countDocuments({
            eventDate: { $gte: oneMonthAgo }
        });

        const yearlyRegistrations = await Event.countDocuments({
            eventDate: { $gte: oneYearAgo }
        });

        return {
            dailyRegistrations,
            weeklyRegistrations,
            monthlyRegistrations,
            yearlyRegistrations
        };
    } catch (error) {
        console.error('Error fetching event registration stats:', error);
        throw error;
    }
};

module.exports = { getEventRegistrationStats };

const Application = require("../models/Application");
const User = require("../models/User");

const updateUserRating = async (userId, additionalRating) => {
  const user = await User.findById(userId);
  if (!user) return;

  const userApplications = await Application.find({
    $or: [{ user: userId }, { seller: userId }],
    status: "COMPLETED",
    isExcludedFromRating: false,
  });

  const totalRating = userApplications.reduce((sum, app) => {
    if (app.user === userId) {
      return sum + (app.rating.seller || 0);
    } else {
      return sum + (app.rating.buyer || 0);
    }
  }, additionalRating);

  const ratingCount = userApplications.length + 1;

  user.ratings.average = ratingCount ? totalRating / ratingCount : 0;
  user.ratings.count = ratingCount;

  await user.save();
};

module.exports = updateUserRating;

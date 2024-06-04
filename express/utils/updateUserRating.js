const Application = require("../models/Application");
const User = require("../models/User");
const { sendUserUpdate } = require("../socketHandler");
const { formatUserResponse } = require("./formatUserData");

const updateUserRating = async (userId) => {
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
  }, 0);

  const ratingCount = user.ratings.count ? user.ratings.count + 1 : 1;

  user.ratings.average = ratingCount ? totalRating / ratingCount : 0;
  user.ratings.count = ratingCount;

  await user.save();
  await sendUserUpdate(formatUserResponse(user));
};

module.exports = updateUserRating;

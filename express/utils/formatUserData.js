const formatUserResponse = (user) => ({
  telegramId: user.telegramId,
  username: user.username,
  phoneNumber: user.phoneNumber,
  languageCode: user.languageCode,
  allowsWriteToPm: user.allowsWriteToPm,
  authDate: user.authDate,
  location: user.location,
  id: user.id,
  avatar: user.avatar,
  isSuspicious: user.isSuspicious,
  nickname: user.nickname,
  ratings: user.ratings,
  isAnOffice: user.isAnOffice,
  delivery: user.delivery,
  disableTrading: user.disableTrading,
});
module.exports = {
  formatUserResponse,
};

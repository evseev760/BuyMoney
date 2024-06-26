const User = require("../models/User");

const applicationWithPartner = async (application, id) => {
  const isSell = application.seller === id;
  const partner = await User.findOne({
    _id: isSell ? application.user : application.seller,
  }).select("-allowsWriteToPm -location -authDate");

  const partnerData = partner.toObject();
  delete partnerData.allowsWriteToPm;
  delete partnerData.location;
  delete partnerData.authDate;

  return { ...application.toObject(), partnerData };
};

module.exports = { applicationWithPartner };

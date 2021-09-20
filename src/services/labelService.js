const labelRepo = require('../repositories/labelRepo');
const commonRepo = require('../repositories/commonRepo');
const { Op, QueryTypes } = require('sequelize');

const findAllMatchingLabels = (labelName) => {
  return labelRepo.findAll({
    where: { name: { [Op.like]: `%${labelName}%` } },
  });
};

const deleteInfantLabels = () => {
  const queryString = `DELETE l from labels l left join image_label il on l.id = il.labelId where il.labelId is null`;
  return commonRepo.executeQuery(queryString, {
    type: QueryTypes.DELETE,
  });
};

module.exports = {
  findAllMatchingLabels,
  deleteInfantLabels,
};

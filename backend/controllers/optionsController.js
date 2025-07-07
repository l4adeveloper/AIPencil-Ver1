let optionsStore = {};

exports.saveOptions = (req, res) => {
  optionsStore = { ...optionsStore, ...req.body.options };
  res.json({ success: true, options: optionsStore });
};

exports.getOptions = (req, res) => {
  res.json(optionsStore);
};

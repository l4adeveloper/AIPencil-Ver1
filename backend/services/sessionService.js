global.conversationHistories = {};

exports.getOrCreateUserSession = async (userId) => {
  const id = userId || 'guest';
  if (!global.conversationHistories[id]) {
    global.conversationHistories[id] = [];
  }
  return id;
};

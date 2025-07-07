function markdownToHtml(text) {
  if (typeof text !== 'string' || !text.trim()) return text || '';
  return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}

function basicTextFormatting(text) {
  if (typeof text !== 'string' || !text.trim()) return text || '';
  return text.replace(/\n/g, '<br>');
}

exports.formatReply = function(model, text) {
  if (model.startsWith("GPT") || model.startsWith("Claude") || model.startsWith("DeepSeek")) {
    return markdownToHtml(text);
  }
  return basicTextFormatting(text);
};

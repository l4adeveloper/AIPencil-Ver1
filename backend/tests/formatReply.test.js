const assert = require('assert');
const { formatReply } = require('../utils/formatReply');

function testMarkdownConversion() {
  const input = '**bold**';
  const expected = '<b>bold</b>';
  const result = formatReply('GPT-4', input);
  assert.strictEqual(result, expected, 'Markdown **bold** should convert to <b>bold</b>');
}

function testLineBreaksAndMarkdown() {
  const input = '**bold**\nnext';
  const expected = '<b>bold</b><br>next';
  const result = formatReply('Claude-3', input);
  assert.strictEqual(result, expected, 'Markdown and newline should convert properly');
}

function testBasicLineBreaks() {
  const input = 'line1\nline2';
  const expected = 'line1<br>line2';
  const result = formatReply('OtherModel', input);
  assert.strictEqual(result, expected, 'Newlines should be converted to <br> only');
}

function run() {
  testMarkdownConversion();
  testLineBreaksAndMarkdown();
  testBasicLineBreaks();
  console.log('All tests passed.');
}

run();

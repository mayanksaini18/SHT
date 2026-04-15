const Anthropic = require('@anthropic-ai/sdk');

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5';

function isEnabled() {
  return !!client;
}

function getClient() {
  return client;
}

function getModel() {
  return MODEL;
}

module.exports = { isEnabled, getClient, getModel };

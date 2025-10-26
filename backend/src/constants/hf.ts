export const HF = {
  API_URL: 'https://router.huggingface.co/v1/chat/completions',
  MODEL_ID: process.env.HF_MODEL_ID || 'facebook/bart-large-cnn',
  TOKEN: process.env.HF_API_KEY || '',
} as const;

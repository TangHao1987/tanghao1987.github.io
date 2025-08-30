// Import all images so Vite includes them in the build
import profileImg from './profile.jpg';
import llmSettingsHeader from './llm_settings_header.png';
import llmSettingImg1 from './llm_setting_img1.png';
import llmSettingImg2 from './llm_setting_img2.png';
import llmSettingImg3 from './llm_setting_img3.png';

// Understanding LLM images
import llmJpeg from './understanding-llm/LLM.jpeg';
import feedForward from './understanding-llm/feed_forward.png';
import softmax from './understanding-llm/softmax.png';
import embedding from './understanding-llm/embedding.png';
import attention from './understanding-llm/attention.png';
import rnn from './understanding-llm/rnn.png';
import addNorm from './understanding-llm/add_norm.png';
import transformer from './understanding-llm/transformer.png';
import multiHeadAttention from './understanding-llm/multi-head-attention.webp';
import backGif from './understanding-llm/back.gif';
import forwardGif from './understanding-llm/forward.gif';
import lossFunc from './understanding-llm/loss-func.png';
import neuralNetwork from './understanding-llm/neural-network.png';

// Export all image paths for use in components
export const images = {
  profile: profileImg,
  llmSettingsHeader,
  llmSettingImg1,
  llmSettingImg2,
  llmSettingImg3,
  understandingLLM: {
    llm: llmJpeg,
    feedForward,
    softmax,
    embedding,
    attention,
    rnn,
    addNorm,
    transformer,
    multiHeadAttention,
    backGif,
    forwardGif,
    lossFunc,
    neuralNetwork
  }
};

// Also export individual images for backward compatibility
export {
  profileImg,
  llmSettingsHeader,
  llmSettingImg1,
  llmSettingImg2,
  llmSettingImg3,
  llmJpeg,
  feedForward,
  softmax,
  embedding,
  attention,
  rnn,
  addNorm,
  transformer,
  multiHeadAttention,
  backGif,
  forwardGif,
  lossFunc,
  neuralNetwork
};

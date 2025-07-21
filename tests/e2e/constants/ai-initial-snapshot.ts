import PROMPT_MESSAGES from '@/constants/prompt-messages';

const AI_INITIAL_SNAPSHOT = `
      - text: AI
      - paragraph: ${PROMPT_MESSAGES.INITIAL_MESSAGE_UNTIMED}
      - textbox "Your message here"
      - button "Submit"
      `;

export default AI_INITIAL_SNAPSHOT;

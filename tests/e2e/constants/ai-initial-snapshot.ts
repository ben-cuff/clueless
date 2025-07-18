import { INITIAL_MESSAGE_UNTIMED } from "@/constants/prompt-fillers";

const AI_INITIAL_SNAPSHOT = `
      - text: AI
      - paragraph: ${INITIAL_MESSAGE_UNTIMED}
      - textbox "Your message here"
      - button "Submit"
      `;

export default AI_INITIAL_SNAPSHOT;

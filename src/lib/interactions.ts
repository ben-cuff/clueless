import { CluelessInteractionTrackerClient } from "clueless-interactions";

const cluelessInteractionsLib = new CluelessInteractionTrackerClient(
  process.env.CLUELESS_INTERACTIONS_DB || ""
);

cluelessInteractionsLib.createContextIndex("userId");

export { cluelessInteractionsLib };

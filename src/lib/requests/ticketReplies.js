import { getConfig } from "lib";
const ticketCommentRepliesConfig = (action) =>
  getConfig({ module: "Support", action });

const prefix = `/api/ticketcommentreplies`;

export const addTicketRepliesConfig = () => ({
  url: `${prefix}`,
  config: ticketCommentRepliesConfig('Create'),
});
export const deleteTicketRepliesConfig = (id) => ({
  url: `${prefix}/${id}`,
  config: ticketCommentRepliesConfig('Create'),
});

import {
  APIError,
  type PayloadRequest,
  type CollectionBeforeChangeHook,
  type CollectionBeforeDeleteHook,
} from "payload";

export const isAdmin = ({ req }: { req: PayloadRequest }) =>
  Boolean(req.user && "role" in req.user && req.user.role === "admin");
export const publicRead = () => true;
export const protectUserCreation: CollectionBeforeChangeHook = ({
  operation,
  req,
  data,
}) => {
  if (
    operation === "create" &&
    !req.user &&
    req.context.bootstrapAdmin !== true
  ) {
    throw new APIError("Herkese açık yönetici kaydı kapalıdır.", 403);
  }
  return data;
};
export const protectLastAdmin: CollectionBeforeDeleteHook = async ({ req }) => {
  const count = await req.payload.count({
    collection: "users",
    overrideAccess: true,
    req,
  });
  if (count.totalDocs <= 1)
    throw new APIError("Son yönetici hesabı silinemez.", 400);
};

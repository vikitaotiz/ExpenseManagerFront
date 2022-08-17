import { storageId } from "src/utilities/constants";

export default (to, from, next) => {
  let auth = JSON.parse(localStorage.getItem(storageId))?.user;
  if (!auth) return false;
  return next({ name: "Login" });
};

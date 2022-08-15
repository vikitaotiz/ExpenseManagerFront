export default function auth({ next, router }) {
  if (!localStorage.getItem("exp-user")) {
    return router.push("/");
  }

  return next();
}

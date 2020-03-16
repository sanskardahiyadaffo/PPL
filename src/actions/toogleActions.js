export const isLogin = "isLogin";

export function toggelisLogin(val) {
  return {
    type: isLogin,
    value: val
  };
}

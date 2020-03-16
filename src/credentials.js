module.exports = {
  myUrl:
    window.location.href
      .split(":")
      .splice(0, 2)
      .join(":") + ":8081"
};

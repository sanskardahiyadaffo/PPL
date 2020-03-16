const myDB = require("../schemas/userPostSchema");
//Use User Login Schema
// For mongodb Id's

module.exports = {
  getPostsFilter: () =>
    new Promise((resolve, reject) => {
      myDB.find((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }),
  getAllPost: () =>
    new Promise((resolve, reject) => {
      myDB.find({}, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }),
  updateUserPost: (filter, update) =>
    new Promise((resolve, reject) => {
      console.log(filter, update, "<<this will executed");
      myDB.updateOne(filter, update, (err, result) => {
        if (err) {
          console.log("err");
          reject("false");
        } else console.log(result);
        resolve(result);
      });
    }),
  addUserPost: postData =>
    new Promise((resolve, reject) => {
      myDB.create(postData, (err, result) => {
        if (err) {
          console.log("Insertion Failed");
          reject({
            name: "Database Error",
            value: err
          });
        } else {
          resolve(result);
        }
      });
    })
};

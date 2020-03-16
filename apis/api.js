const myDB = require("../schemas/userProfileSchema");
//Use User Login Schema
// For mongodb Id's

module.exports = {
  getUserById: _id =>
    new Promise((resolve, reject) => {
      myDB.find({ _id: _id }, (err, result) => {
        if (err) reject(err);
        else {
          resolve(result);
        }
      });
    }),
  adduser: userdata =>
    new Promise((resolve, reject) => {
      myDB.create(userdata, (err, result) => {
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
    }),

  getValidation: (mydata, keyname) =>
    new Promise((resolve, reject) => {
      myDB.findOne({ [keyname]: mydata }, (err, data) => {
        // console.log({ [keyname]: mydata })
        if (err) {
          reject({
            name: "Database Error",
            value: err
          });
        } else {
          if (data)
            reject({
              name: keyname + " Already Exists",
              value: null
            });
          else
            resolve({
              name: "Validate"
            });
        }
      });
    }),
  getdata: myData =>
    new Promise((resolve, reject) => {
      let filter = {};
      myData.name = myData.name || myData.username || myData.email;
      if (myData.name) {
        filter = {
          $or: [{ email: myData.name }, { username: myData.name }]
        };
        myDB.findOne(filter, (err, result) => {
          if (err) {
            console.log("/api.js: Finding Failed");
            reject({
              name: "Database Error",
              value: err
            });
          } else {
            console.log(result, "<<<");
            if (result)
              if (myData.password === result.password) resolve(result);
              else
                reject({
                  name: "Password-MisMatch",
                  value: null
                });
            else
              reject({
                name: "User Not Found",
                value: null
              });
          }
        });
      } else {
        reject({
          name: "NO Data Found"
        });
      }
    })
};

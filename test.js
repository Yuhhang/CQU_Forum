let axios = require("axios");


// axios
//   .get("http://server.messi1.top:3000/users")
//   .then(response => {
//     // handle success
//     console.log(response.data);
//   })
//   .catch(error => {
//     // handle error
//     //   console.log(error);
//   });




axios
  .post("http://server.messi1.top:3000/login", {
    username: "yuhang1",
    pswd: "yh9903081"
  })
  .then(response => {
    // handle success
    console.log(response.data);
  })
  .catch(error => {
    // handle error
      console.log(error);
  });

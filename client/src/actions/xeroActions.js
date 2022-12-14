import axios from "axios";

// const ZAIO_DB_URL = process.env.REACT_APP_BACKEND_URL;
// const XERO_URL = process.env.REACT_APP_XERO_URL;
// const ZAIO_DB_URL = "https://nameless-waters-24981.herokuapp.com";
const ZAIO_DB_URL = "http://localhost:4000";

const invoice = {
  getUser(email) {
    return axios
      .post(ZAIO_DB_URL + "/user", { email: email })
      .then((res) => {
        console.log(res.data, "res.data[0]");
        return res.data;
      })
      .catch((rej) => {
        return rej;
      });
  },

  addXeroContactId(userData) {
    console.log(userData, "addXeroContactId");
    return axios
      .post(ZAIO_DB_URL + "/addXeroContactId", userData)
      .then((res) => {
        console.log(res.data, "res.data[0]");
        return res.data;
      })
      .catch((rej) => {
        return rej;
      });
  },

  userTutorAccount() {
    return axios
      .get(ZAIO_DB_URL + "/usertutoraccount")
      .then((res) => {
        console.log(res.data, "res.data[0]");
        return res.data;
      })
      .catch((rej) => {
        return rej;
      });
  },

  createContact(userData) {
    console.log(userData, "createContact");
    return axios
      .post("/api/contact", userData)
      .then((res) => {
        console.log(res, "createContact2");
        return res.data;
      })
      .catch((rej) => {
        return rej;
      });
  },

  createInvoice(userData) {
    console.log(userData, "for createInvoice");
    return axios
      .post("/api/createInvoice", userData)
      .then((res) => {
        console.log(res, "action res");
        return res.data;
      })
      .catch((rej) => {
        return rej;
      });
  },
};

export default invoice;

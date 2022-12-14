import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";

import { Typeahead } from "react-bootstrap-typeahead";

import xeroActions from "../actions/xeroActions.js";

const ZAIO_DB_URL = "http://localhost:4000";

const Invoice = (props) => {
  const [state, setState] = useState({
    username: "",
    email: "",
    description: "",
    quantity: "",
    unitPrice: "",
  });

  // ******************************************

  const [nameSelectedTo, setNameSelectedto] = useState();
  const [paidUserName, setPaidUserName] = useState();
  const [allData, setAllData] = useState([]);

  const getUserPaid = async () => {
    const getUSer = await xeroActions.userTutorAccount();
    setAllData(getUSer);
    setPaidUserName(
      getUSer.data.map(
        (item) => `${item?.userid?.username} ( ${item?.userid?.email} )`
      )
    );
  };

  useEffect(() => {
    getUserPaid();
  }, []);

  useEffect(() => {
    if (nameSelectedTo) {
      const fill = allData.data?.find(
        (item) => item?.userid?.username === nameSelectedTo?.toString()
      );

      setState((prevState) => ({
        ...prevState,
        ["username"]: nameSelectedTo[0],
        ["email"]: fill?.userid?.email,
      }));
    }
  }, [nameSelectedTo]);

  const nameSelected = (value) => {
    if (value[0]) {
      setNameSelectedto([value[0].slice(0, value[0].indexOf("(") - 1)]);
    } else setNameSelectedto();
  };

  // ******************************************

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    const response = await xeroActions.getUser(state.email);
    const user = response.data;

    if (!user.xeroContactId) {
      console.log(user, "user for create contact");
      xeroActions
        .createContact(user)
        .then(async (contactID) => {
          console.log(contactID, "contact created");

          await xeroActions
            .addXeroContactId({ email: state.email, contactID: contactID })
            .then((response) => {
              xeroActions
                .createInvoice({ ...state, xeroContactId: contactID })
                .then(async (res) => {
                  console.log(res, "react console");
                  try {
                    await axios.post(`${ZAIO_DB_URL}/invoice`, {
                      ...res.invoices[0],
                      email: user.email,
                    });
                  } catch (err) {
                    return res.json(err);
                  }
                });
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      xeroActions
        .createInvoice({ ...state, xeroContactId: user.xeroContactId })
        .then(async (res) => {
          console.log(res, "react console");
          try {
            await axios.post(`${ZAIO_DB_URL}/invoice`, {
              ...res.invoices[0],
              email: user.email,
            });
          } catch (err) {
            return res.json(err);
          }
        });
    }

    console.log(state);
  };

  return (
    <div>
      <h1>Invoice Form</h1>
      <Form className="register-form" onSubmit={handleOnSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Username</Form.Label>

          <Typeahead
            id="basic-example"
            onChange={nameSelected}
            options={paidUserName ? paidUserName : ["Loading..."]}
            placeholder="Choose a name..."
            selected={nameSelectedTo}
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="User Email"
            name="email"
            disabled
            value={state.email}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group controlId="Description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            name="description"
            value={state.description}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="Quantity">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Quantity"
            name="quantity"
            value={state.quantity}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Form.Group controlId="UnitPrice">
          <Form.Label>Unit Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Unit Price"
            name="unitPrice"
            value={state.unitPrice}
            onChange={handleInputChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </div>
  );
};

export default Invoice;

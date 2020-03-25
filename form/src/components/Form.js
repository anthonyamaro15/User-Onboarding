import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  name: yup.string().required("please enter name"),
  email: yup
    .string()
    .email("invalid email")
    .required("please enter email"),
  password: yup
    .string()
    .min(4, "password must be longer")
    .required("please enter password"),
  terms: yup.boolean().oneOf([true], "please agree to terms and conditions")
});

const Form = () => {
  const [data, setData] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });

  useEffect(() => {
    schema.isValid(userInfo).then(valid => {
      setBtnDisabled(!valid);
    });
  }, [userInfo]);

  const validateSchema = e => {
    yup
      .reach(schema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors
        });
      });
  };

  const handleChange = e => {
    e.persist();
    const newUserInfo = {
      ...userInfo,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };

    validateSchema(e);
    setUserInfo(newUserInfo);
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", userInfo)
      .then(res => {
        setData(res.data);
        console.log(res.data);
        setUserInfo({
          name: "",
          email: "",
          password: "",
          terms: ""
        });
      })
      .catch(err => console.log(err));
  };
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">
        Name
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          value={userInfo.name}
        />
      </label>
      Email
      <label htmlFor="email">
        <input
          type="email"
          id="email"
          name="email"
          onChange={handleChange}
          value={userInfo.email}
        />
      </label>
      Password
      <label htmlFor="password">
        <input
          type="password"
          id="pasword"
          name="password"
          onChange={handleChange}
          value={userInfo.password}
        />
      </label>
      <label htmlFor="terms">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          onChange={handleChange}
          value={userInfo.terms}
        />
        Terms of Service
      </label>
      <button type="submit" disabled={btnDisabled}>
        Submit
      </button>
    </form>
  );
};

export default Form;

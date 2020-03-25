import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

const fakeEmails = ["example@gmail.com", "anthony@gmail.com", "lalo@gmail.com"];

const schema = yup.object().shape({
  name: yup.string().required("please enter name"),
  email: yup
    .string()
    .lowercase()
    .email("invalid email")
    .notOneOf(fakeEmails, "Email is already taken")
    .required("please enter email"),
  password: yup
    .string()
    .min(4, "password must be longer")
    .required("please enter password"),
  terms: yup.boolean().oneOf([true], "please agree to terms and conditions"),
  role: yup.string().required("please select a positon")
});

const Form = () => {
  const [data, setData] = useState([]);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [emptyData, setEmptyData] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
    role: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
    role: ""
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
          [e.target.name]: err.errors[0]
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
        setData([...data, res.data]);
        setEmptyData(true);
        setUserInfo({
          name: "",
          email: "",
          password: "",
          terms: "",
          role: ""
        });
      })
      .catch(err => console.log(err));
  };

  return (
    <div>
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
          {errors.name && <p className="error">{errors.name}</p>}
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
          {errors.email && <p className="error">{errors.email}</p>}
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
          {errors.password && <p className="error">{errors.password}</p>}
        </label>
        <label htmlFor="role">
          Select Role
          <select name="role" id="role" onChange={handleChange}>
            <option value="">Enter Positon</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
          </select>
          {errors.role && <p className="error">{errors.role}</p>}
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

      {emptyData ? (
        <div>
          {data.map((user, i) => (
            <div className="display-info" key={i}>
              {JSON.stringify(user, null, 2)}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Form;

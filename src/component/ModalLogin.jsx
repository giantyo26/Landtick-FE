import { Button, Modal, Form } from "react-bootstrap";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { UserContext } from "../context/userContext";
import { API, setAuthToken } from "../config/api";
import Swal from 'sweetalert2'

export const Login = (props) => {
  const Navigate = useNavigate();

  const [_, dispatch] = useContext(UserContext);

  const [formLogin, setFormLogin] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formLogin;

  const OnChangeHandler = (e) => {
    setFormLogin({
      ...formLogin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const response = await API.post("/login", formLogin);

      console.log("login success : ", response);

      // Send data to useContext
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data.data,
      });

      setAuthToken(response.data.data.token);

      // Status check
      if (response.data.data.role === "admin") {
        Navigate("/");
      } else {
        Navigate("/");
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Login Success',
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Login Failed',
        showConfirmButton: false,
        timer: 1500
      })
      console.log("login failed : ", error);
    }
    props.onHide();
  });

  return (
    <>
      <Modal show={props.show} onHide={props.onHide} aria-labelledby="contained-modal-title-vcenter" centered>
        <div className="px-5 pb-3">
          <p className="fs-3 fw-bold text-center" style={{ color: "#EC7AB7", paddingTop: 45 }}>
            LOGIN
          </p>
          <Form className="mt-4" onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                className="p-2 mb-3"
                onChange={OnChangeHandler}
                name="username"
                value={username}
                type="text"
                placeholder="Username"
                style={{
                  textColor: "#B1B1B1",
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #B1B1B1",
                }}
              />
              <Form.Control
                type="password"
                onChange={OnChangeHandler}
                name="password"
                value={password}
                placeholder="Password"
                style={{
                  backgroundColor: "rgba(97, 61, 43, 0.25)",
                  border: "2px solid #B1B1B1",
                }}
              />
            </Form.Group>
            <Button type="submit" className="fw-bold border-0 w-100 py-2 mt-3" style={{ background: "linear-gradient(180deg, #EC7AB7 0%, #EC7A7A 100%)", borderRadius: "50px" }}>
              Login
            </Button>
          </Form>

          <p className="text-center mt-3">
            Belum Punya Akun ? Klik{" "}
            <span onClick={props.onClick} className="fw-bold" style={{ cursor: "pointer" }}>
              Disini
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Login;

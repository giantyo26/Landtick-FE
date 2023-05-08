import React, { useState } from "react";
import Footer from "../component/Footer";
import { Form, Button } from "react-bootstrap";
import { API } from "../config/api";
import { useMutation } from "react-query";
import Swal from "sweetalert2";

export default function AddTicket() {
  const [form, setForm] = useState({
    name: "",
    city: "",
  });
  console.log(form);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("city", form.city);

      const response = await API.post("/stations", formData);
      if (response.status === 200) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "New station has been added!",
          showConfirmButton: false,
          timer: 1000,
        });
        setForm({
          name: "",
          city: "",
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to add station",
        showConfirmButton: false,
        timer: 800,
      });
      console.log(error);
    }
  });

  return (
    <>
      <div className="container mt-5">
        <h1 className="fw-bold">Add Station</h1>
        <Form
          className="mt-5"
          onSubmit={(e) => {
            handleSubmit.mutate(e);
          }}
        >
          <Form.Group className="mb-3">
            <Form.Control type="text" name="name" placeholder="Station Name" onChange={handleChange} value={form.name} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control type="text" name="city" placeholder="City" onChange={handleChange} value={form.city} />
          </Form.Group>

          <Button className="mt-5" variant="outline-light fw-bold" type="submit" style={{ width: "535px", height: "50px", background: "#0ACF83", marginLeft: "282px" }}>
            Save
          </Button>
        </Form>
      </div>
      <Footer />
    </>
  );
}

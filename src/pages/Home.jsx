import React, { useState, useContext, useEffect } from "react";
import Jumbotron from "../component/Jumbotron";
import Ticket from "../component/Ticket";
import Footer from "../component/Footer";
import { Form, Button } from "react-bootstrap";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";
import { useQuery } from "react-query";

export default function Home(props) {
  const [showLogin, setShowLogin] = useState(false);
  const [state] = useContext(UserContext);
  const [formSearch, setFormSearch] = useState({
    departure_date: "",
    start_station_id: "",
    destination_station_id: "",
  });
  const [filteredTicket, setFilteredTicket] = useState([]);

  useEffect(() => {
    if (state.isLogin === true) {
      setShowLogin(false);
    }
  }, [state.isLogin]);

  const handleChange = (e) => {
    setFormSearch({
      ...formSearch,
      [e.target.name]: e.target.value,
    });
  };

  const { data: stations } = useQuery("stationsCache", async () => {
    const response = await API.get("/stations");
    return response.data.data;
  });

  // Global scoped URL variable
  let url = `/filter-tickets`
  // Fetch the search results
  const { data: ticketData } = useQuery("filterTicketCache", async () => {
    const response = await API.get(url);

      if (response.status === 200) {
        // Update the filter results
        setFilteredTicket(response.data.data);
      } else {
        // Display an error message
        throw new Error(response.data.message)
      }
    return response.data.data;
    }, 
    {
      enabled: false, // Disable the query by default (must refetch)
    }
  );

  // Handle seatch filter by form
  const handleFilter = (e) => {
    e.preventDefault();
    // Add the filter parameters to the URL if they're provided
    if (formSearch.departure_date) {
      url += `?departure_date=${formSearch.departure_date}`;
    }

    if (formSearch.start_station_id) {
      url += `${formSearch.departure_date ? '&' : '?'}start_station_id=${formSearch.start_station_id}`;
    }

    if (formSearch.destination_station_id) {
      url += `${formSearch.departure_date || formSearch.start_station_id ? '&' : '?'}destination_station_id=${formSearch.destination_station_id}`;
    }

    // Enable useQuery to fetch the search results
    if (ticketData) {
      ticketData?.refetch()
    }
    console.log("success")
    console.log(ticketData)
  };

  return (
    <>
      <Jumbotron />
      <div className="d-flex" style={{ background: "#FFFFFF", width: "1220px", height: "236px", marginTop: "-40px", boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.25)", marginLeft: "60px", borderRadius: "5px" }}>
        <div className="d-flex" style={{ background: "#F2F2F2", width: "284px", height: "236px", borderRadius: "5px" }}>
          <div className="mt-4" style={{ background: "#E67E22", width: "9px", height: "53px" }}></div>
          <div className="d-flex mt-4" style={{ background: "#FFFFFF", width: "284px", height: "53px" }}>
            <img className="items-center my-auto" src="/images/Icon.png" alt="" style={{ width: "30px", height: "30px" }} />
            <h5 className="items-center ms-3 my-auto">Tiket Kereta Api</h5>
          </div>
        </div>
        <div className="ms-3 mt-2">
          <form id="ticket-search-form">
            <h4>Tiket Kereta Api</h4>
            <div className="d-flex">
              <div style={{ width: "400px" }}>
                <h5>Asal</h5>
                <div className="">
                  <Form.Select aria-label="Default select example" name="start_station_id" onChange={handleChange} value={formSearch.start_station_id}>
                    <option hidden>Start Station</option>
                    {stations?.map((item) => (
                      <option key={item.id} value={item?.id}>
                        {item.name} {item.city}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="d-flex">
                  <h5 className="mt-3">Tanggal Berangkat</h5>
                  <div className="d-flex">
                    <Form.Group className="ms-5 mt-3 fw-bold" controlId="formBasicCheckbox">
                      <Form.Check type="checkbox" label="Pulang Pergi" />
                    </Form.Group>
                  </div>
                </div>
                <Form.Control className="mt-2" type="date" onChange={handleChange} value={formSearch.departure_date} id="departure_date" name="departure_date" style={{ width: "138px", height: "30px" }} />
              </div>
              <div>
                <img className="mt-4 ms-3" src="/images/switch.png" alt="" style={{ width: "50px", height: "50px" }} />
              </div>
              <div className="ms-3" style={{ width: "400px" }}>
                <h5>Tujuan</h5>
                <div className="">
                  <Form.Select aria-label="Default select example" name="destination_station_id" onChange={handleChange} value={formSearch.destination_station_id}>
                    <option hidden>End Station</option>
                    {stations?.map((item) => (
                      <option key={item.id} value={item?.id}>
                        {item?.name} {item?.city}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="d-flex mt-3">
                  <div>
                    <h5 className="">Dewasa</h5>
                    <Form.Select aria-label="Default select example" name="qty" style={{ width: "116px", height: "auto" }}>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Form.Select>
                  </div>
                  <div className="ms-3">
                    <h5>Bayi</h5>
                    <Form.Select aria-label="Default select example" name="anak" style={{ width: "116px", height: "auto" }}>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Form.Select>
                  </div>
                  <Button
                    onClick={(e) => handleFilter(e)}
                    type="submit"
                    className="ms-3 fw-bold"
                    variant="outline-light"
                    style={{ background: "linear-gradient(90deg, #EC7AB7 -0.6%, #EC7A7A 100%)", width: "134px", height: "auto", marginTop: "30px" }}
                  >
                    Cari Ticket
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="container mx-auto mt-5">
        <div className="w-90 mx-auto">
          <div className="d-flex justify-content-around">
            <h5 className="">Nama Kereta</h5>
            <h5 className="">Berangkat</h5>
            <h5 className="text-white">Jeda</h5>
            <h5 className="">Tiba</h5>
            <h5 className="">Durasi</h5>
            <h5 className="">Harga Per Orang</h5>
          </div>
        </div>
      </div>
      <Ticket filteredTickets={filteredTicket} />
      <Footer />
    </>
  );
}

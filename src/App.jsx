import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
  MDBBtn,
  MDBBtnGroup,
  MDBPagination,
  MDBPaginationItem,
  MDBPaginationLink
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [page, setPage] = useState(0);
  const [pageLimit] = useState(5);
  const [sortFilterValue, setSortFilterValue] = useState("");
  const [operation, setOperation] = useState("");

  const sortOptions = ["name", "email", "phone", "address", "status"];

  useEffect(() => {
    loadUsersData(0, 5, 0);
  }, []);

  const loadUsersData = async (start, end, increase, optType = null, filterOrSortValue) => {
    switch (optType) {
      case "search":
        setOperation(optType);
        setSortValue("");
        return await axios.get(`http://localhost:5000/users?q=${value}&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setPage(page + increase);
          })
          .catch((error) => console.log(error));
      case "sort":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue)
        return await axios.get(`http://localhost:5000/users?_sort=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setPage(page + increase);
          })
          .catch((error) => console.log(error));
      case "filter":
        setOperation(optType);
        setSortFilterValue(filterOrSortValue)
        return await axios.get(`http://localhost:5000/users?status=${filterOrSortValue}&_order=asc&_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setPage(page + increase);
          })
          .catch((error) => console.log(error));
      default:
        return await axios.get(`http://localhost:5000/users?_start=${start}&_end=${end}`)
          .then((response) => {
            setData(response.data);
            setPage(page + increase);
          })
          .catch((error) => { console.log(error); });
    }
  }

  console.log("Data", data);

  const handleSearch = async (e) => {
    e.preventDefault();
    loadUsersData(0, 5, 0, "search")
    // return await axios.get(`http://localhost:5000/users?q=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //     setValue("");
    //   })
    //   .catch((error) => console.log(error));
  }

  const handleReset = () => {
    setOperation("")
    setValue("");
    setSortFilterValue("");
    setSortValue("")
    loadUsersData(0, 5, 0);
  }

  const handleSort = async (e) => {
    let value = e.target.value;
    setSortValue(value);
    loadUsersData(0, 5, 0, "sort", value);
    // return await axios.get(`http://localhost:5000/users?_sort=${value}&_order=asc`)
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((error) => console.log(error));
  }

  const handleFilter = async (value) => {
    loadUsersData(0, 5, 0, "filter", value);
    // return await axios.get(`http://localhost:5000/users?status=${value}`)
    //   .then((response) => {
    //     setData(response.data);
    //   })
    //   .catch((error) => console.log(error));
  }

  const renderPagination = () => {
    if (data.length < 5 && page === 0) { return null }
    if (page === 0) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBPaginationItem style={{ marginLeft: "20px", marginRight: "20px" }}>1</MDBPaginationItem>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData(5, 10, 1, operation, sortFilterValue)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else if (page < pageLimit - 1 && data.length === pageLimit) {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData((page - 1) * 5, page * 5, -1, operation, sortFilterValue)}>
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationItem style={{ marginLeft: "20px", marginRight: "20px" }}>{page + 1}</MDBPaginationItem>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData((page + 1) * 5, (page + 2) * 5, 1, operation, sortFilterValue)}>
              Next
            </MDBBtn>
          </MDBPaginationItem>
        </MDBPagination>
      )
    } else {
      return (
        <MDBPagination className='mb-0'>
          <MDBPaginationItem>
            <MDBBtn onClick={() => loadUsersData((page - 1) * 5, page * 5, -1, operation, sortFilterValue)}>
              Prev
            </MDBBtn>
          </MDBPaginationItem>
          <MDBPaginationItem>
            <MDBPaginationLink style={{ marginLeft: "20px", marginRight: "20px" }}>{page + 1}</MDBPaginationLink>
          </MDBPaginationItem>
        </MDBPagination>
      )
    }
  }

  return (
    <MDBContainer>
      <form style={{
        margin: "auto",
        padding: "15px",
        maxWidth: "400px",
        alignContent: "center",
      }}
        className="d-flex input-group w-auto"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search Name... "
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <MDBBtn type='submit' color='dark'>Search</MDBBtn>
        <MDBBtn className='mx-2' color='info' onClick={() => handleReset()}>Reset</MDBBtn>
      </form>
      <div style={{ marginTop: "20px" }}>
        <h2 className='text-center'>Search, Filter, Sort, Pagination using using JSON Server</h2>
        <MDBRow>
          <MDBCol size="12">
            <MDBTable>
              <MDBTableHead dark>
                <tr>
                  <th scope='col'>No.</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Phone</th>
                  <th scope='col'>Address</th>
                  <th scope='col'>Status</th>
                </tr>
              </MDBTableHead>
              {data.length === 0 ? (
                <MDBTableBody className='align-center mb-0'>
                  <tr>
                    <td colSpan={8} className='text-centre mb-0'>No Data Found</td>
                  </tr>
                </MDBTableBody>
              ) : (
                data.map((item, index) => (
                  <MDBTableBody key={item.id}>
                    <tr>
                      <th scope='row'>{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.address}</td>
                      <td>{item.status}</td>
                    </tr>
                  </MDBTableBody>
                ))
              )}
            </MDBTable>
          </MDBCol>
        </MDBRow>
        <div style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "200px",
          alignContent: "center",
        }}>{renderPagination()}</div>
      </div>
      {data.length > 0 && (
        <MDBRow>
          <MDBCol size="6" style={{ margin: "0px 40px 40px 40px" }}>
            <h5>Sort By:</h5>
            <select style={{ width: "50%", borderRadius: "2px", height: "35px" }}
              onChange={handleSort}
              value={sortValue}
            >
              <option>Please Select Value</option>
              {sortOptions.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))}
            </select>
          </MDBCol>
          <MDBCol size="4" style={{ margin: "0px 40px 40px 70px" }}>
            <h5>Filter By Status:</h5>
            <MDBBtnGroup>
              <MDBBtn color='success' onClick={() => handleFilter("Active")}>Active</MDBBtn>
              <MDBBtn color='danger' style={{ marginLeft: "2px" }} onClick={() => handleFilter("Inactive")}>Inactive</MDBBtn>
            </MDBBtnGroup>
          </MDBCol>
        </MDBRow>
      )}
    </MDBContainer>
  );
}

export default App;

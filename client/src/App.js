import "./App.css";

import { useEffect, useState, useRef } from "react";
import NpiTable from "./NpiTable";
import ReactToPrint from "react-to-print";
// mui
import {
  Alert,
  Box,
  Button,
  Container,
  LinearProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// graphics
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import logo from "./img/medical-group.jpg";

function App() {
  const [providerData, setProviderData] = useState([]);
  const [hideAlert, setHideAlert] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [npi, setNpi] = useState();
  let tableRef = useRef();
  const apiURL = `http://localhost:3000/providers_search/`;

  // handles on change for NPI search form
  const handleInput = (e) => {
    setNpi(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const regEx = /^[0-9]*$/; //checking for numeric inputs only
    if (npi.length === 10 && regEx.test(npi)) {
      setLoading(true);

      fetch(`${apiURL}${npi}`).then((res) => {
        if (res.ok) {
          res
            .json()
            .then((data) => {
              setProviderData(data.results.concat(providerData));
              setLoading(false);
              setNpi("");
            })
            .catch((err) => {
              setError(err.message);
              setHideAlert(false);
              setNpi("");
              console.log(error);
            });
        }
      });
    } else {
      setHideAlert(false);
      setTimeout(() => setHideAlert(true), 3000);
    }
  };
  // prevents duplicate keys in table shown
  const uniqueTable = providerData.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      providerData.findIndex((table) => {
        return JSON.stringify(table) === _value;
      })
    );
  });
  // ------Local Storage Section -------
  // Runs on page load to check for stored sessions
  useEffect(() => {
    if (localStorage.getItem("queries")) {
      setProviderData(JSON.parse(localStorage.getItem("queries")));
    }
  }, []);

  // runs every time our table changes and stores the data
  useEffect(() => {
    localStorage.setItem("queries", JSON.stringify(providerData));
  }, [providerData]);

  const clearLocalStorage = () => {
    localStorage.clear();
    setProviderData([]);
  };
  return (
    <Container className="App" maxWidth="lg">
      <Box className="App-header">
        <img src={logo} alt="" className="App-logo" />
      </Box>
      <Box id="npi-form" my={3} onSubmit={handleSubmit} component="form">
        <div className="form-text-field">
          <TextField
            id="npi-input"
            label="NPI"
            variant="filled"
            value={npi}
            onChange={handleInput}
            required
          />
          {!hideAlert ? (
            <Alert severity="error">
              Your input is invalid, NPI must be a number and 10 characters
              long.
            </Alert>
          ) : (
            ""
          )}
        </div>

        <Box mt={1}>
          <Tooltip title="Search for Providers">
            <Button
              type="submit"
              variant="contained"
              color="info"
              endIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Tooltip>
          <ReactToPrint
            content={() => tableRef}
            trigger={() => (
              <Tooltip title="Print Table">
                <Button
                  variant="contained"
                  endIcon={<PrintIcon />}
                  color="info"
                  sx={{ marginLeft: 3 }}
                >
                  Print
                </Button>
              </Tooltip>
            )}
          />
          <Tooltip title="Clear Current Entries">
            <Button
              variant="contained"
              endIcon={<DeleteIcon />}
              onClick={clearLocalStorage}
              color="error"
              sx={{ marginLeft: 3 }}
            >
              Clear
            </Button>
          </Tooltip>
        </Box>
      </Box>
      {loading === true ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        providerData && (
          <TableContainer
            component={Paper}
            id="table"
            ref={(el) => (tableRef = el)}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>NPI</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="left">Address</TableCell>
                  <TableCell align="left">Type</TableCell>
                  <TableCell align="left">Taxonomy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="fade-in">
                {uniqueTable.map((provider) => (
                  <NpiTable
                    key={provider.number}
                    id={provider.number}
                    name={provider.basic.name}
                    location1={`${provider.addresses[0].address_purpose}: ${
                      provider.addresses[0].address_1
                    },  ${
                      provider.addresses[0].address_2
                        ? provider.addresses[0].address_2 + ","
                        : ""
                    } ${provider.addresses[0].city}, ${
                      provider.addresses[0].state
                    }, ${provider.addresses[0].postal_code}`}
                    location2={`${provider.addresses[1].address_purpose}: ${
                      provider.addresses[1].address_1
                    },  ${
                      provider.addresses[1].address_2
                        ? provider.addresses[1].address_2 + ","
                        : ""
                    } ${provider.addresses[1].city}, ${
                      provider.addresses[1].state
                    }, ${provider.addresses[1].postal_code}`}
                    type={`${provider.enumeration_type}`}
                    taxonomy={`${provider.taxonomies.map((each) => each.desc)}`}
                    taxonomyCode={`${provider.taxonomies.map(
                      (each) => each.code
                    )}`}
                    taxonomyPrimary={`${provider.taxonomies.map(
                      (each) => each.primary
                    )}`}
                    taxonomyLicense={`${provider.taxonomies.map(
                      (each) => each.license
                    )}`}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Container>
  );
}

export default App;

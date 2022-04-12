import "./App.css";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NpiTable from "./NpiTable";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import logo from "./img/NPI Search-logos_transparent.png";

function App() {
  const [providerData, setProviderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [npi, setNpi] = useState();

  const apiURL = `http://localhost:3000/providers_search/`;

  const handleInput = (e) => {
    setNpi(e.target.value);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch(`${apiURL}${npi}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setProviderData(data.results.concat(providerData));
            setLoading(false);
          });
        }
      })
      .catch((err) => {
        setError(err);
        console.log(error);
      });
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
  // Local Storage Section Check
  // Runs on page load to check for stored sessions
  useEffect(() => {
    if (localStorage.getItem("queries")) {
      setProviderData(JSON.parse(localStorage.getItem("queries")));
      console.log(providerData);
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
    <Container className="App" maxWidth="xlg">
      <Box className="App-header">
        <img src={logo} alt="" className="App-logo" />
      </Box>
      <Box id="npi-form" my={3} onSubmit={handleSubmit} component="form">
        <TextField
          id="npi-input"
          label="NPI"
          variant="filled"
          onChange={handleInput}
          required
          sx={{ width: "50%", marginRight: 3 }}
        />
        <Box mt={1}>
          <Button type="submit" variant="contained" endIcon={<SearchIcon />}>
            Search
          </Button>
          <Button
            variant="contained"
            endIcon={<DeleteIcon />}
            onClick={clearLocalStorage}
            color="error"
            sx={{ marginLeft: 3 }}
          >
            Clear
          </Button>
        </Box>
      </Box>
      {loading === true ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        providerData && (
          <TableContainer component={Paper} id="table">
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
              <TableBody>
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

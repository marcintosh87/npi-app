import "./App.css";
import { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NpiTable from "./NpiTable";
import SendIcon from "@mui/icons-material/Send";

function App() {
  const [providerData, setProviderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [npi, setNpi] = useState();
  const [table, setTable] = useState([]);
  const apiURL = `http://127.0.0.1:3000/providers_search/`;

  if (loading === false) {
    console.log(providerData);
    console.log(table);
  }

  const handleInput = (e) => {
    setNpi(e.target.value);
    console.log(npi);
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    fetch(`${apiURL}${npi}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setProviderData(data.results);
            setTable(providerData);
            setTable(data.results.concat(table));

            setLoading(false);
          });
        }
      })
      .catch((err) => {
        setError(err);
        console.log(error);
      });
  };

  return (
    <Container>
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
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>
            Send
          </Button>
        </Box>
      </Box>
      {providerData && (
        <TableContainer component={Paper}>
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
              {table.map((provider) => (
                <NpiTable
                  key={provider.number}
                  id={provider.number}
                  name={`${provider.basic.name_prefix} ${provider.basic.first_name} ${provider.basic.last_name}`}
                  location={provider.addresses[0].address_1}
                  type={`${provider.enumeration_type}`}
                  taxonomy={`${provider.taxonomies.map((each) => each.desc)}`}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App;

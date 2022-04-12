import { TableCell, TableRow, Typography } from "@mui/material";
import React from "react";

export default function NpiTable({
  id,
  name,
  location1,
  location2,
  type,
  taxonomy,
  taxonomyCode,
  taxonomyLicense,
  taxonomyPrimary,
}) {
  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          {id}
        </TableCell>
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">
          {location1} <br />
          {location2 ? location2 : ""}
        </TableCell>
        <TableCell align="left">{type}</TableCell>
        <TableCell align="left">
          <Typography variant="body2">
            <b>Code:</b> {taxonomyCode} <br />
            <b>Description:</b> {taxonomy} <br />
            <b>Primary: {taxonomyPrimary}</b> <br />
            <b>License: {taxonomyLicense}</b>
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
}

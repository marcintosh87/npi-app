import { TableCell, TableRow } from "@mui/material";
import React from "react";

export default function NpiTable({ id, name, location, type, taxonomy }) {
  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell component="th" scope="row">
          {id}
        </TableCell>
        <TableCell align="left">{name}</TableCell>
        <TableCell align="left">{location}</TableCell>
        <TableCell align="left">{type}</TableCell>
        <TableCell align="left">{taxonomy}</TableCell>
      </TableRow>
    </>
  );
}

import { Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Colleagues from "./Colleagues";
import GreenPlates from "./GreenPlates";

export default function Settings() {
  return (
    <div>
      <Colleagues />
      <Box mt={5}>
        <GreenPlates />
      </Box>
    </div>
  );
}

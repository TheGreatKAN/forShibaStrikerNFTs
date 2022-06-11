import * as React from "react";
import styled from "styled-components";
// importing material UI components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { SpacerLarge } from "./styles/globalStyles";

  
export const StyledImg = styled.img`
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.7);

  
  border-radius: 0%;
  width: 120px;
  @media (min-width: 900px) {
    width: 600px;
  }
  @media (min-width: 10000px) {
    width: 200px;
  }
  
`;




export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 0;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretched;
  width: 1000%;
  @media (min-width: 767px)  {
    flex-direction: row;
  }
`;






export default function Header() {
  return (
      <AppBar position="static" style={{backgroundColor: '#ffffff'}}>
      <ResponsiveWrapper>
      <StyledImg alt={"example"} src={"/config/images/punksad.gif"} />
      <StyledImg alt={"example"} src={"/config/images/if1ad2.gif"} />
        <StyledImg alt={"example"} src={"/config/images/if1ad2.gif"} />
        </ResponsiveWrapper>
        
      </AppBar>
  );
}

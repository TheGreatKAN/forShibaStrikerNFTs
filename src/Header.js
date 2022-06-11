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
  @media (min-width:1 px) {
    width: 540px;
  }
  @media (min-width: 1px) {
    width: 540px;
  }
  
`;




export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  backgroundColor: 'lightblue';
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 4px)  {
    flex-direction: row;
  }
`;






export default function Header() {
  return (
      <AppBar position="static" style={{backgroundColor: '#000000'}}>
        
      <ResponsiveWrapper>

      <a href={"https://vr-trinity.com/"}>
      <StyledImg alt={"example"} src={"/config/images/VrTad.gif"} />
      </a>

      <a href={"https://rebrand.ly/Vrtrinity-BannerADD2"}>
      <StyledImg alt={"example"} src={"/config/images/if1ad.gif"} />
      </a>

      <a href={"https://rebrand.ly/vrtrinity-BannerADD"}>
        <StyledImg alt={"example"} src={"/config/images/walletnowad.gif"} />
        </a>
        
        </ResponsiveWrapper>
        
      </AppBar>
  );
}

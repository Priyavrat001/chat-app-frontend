import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/color";

export const VisualyHiddenInput = styled("input")({
    border: 0,
    clip: "react(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1
});

export const Link = styled(LinkComponent)`
text-decoration:none;
color:"black";
padding:1rem;
&:hover:{
    background-color:rgba(0, 0, 0, 0.1)
}
`

export const InputBox = styled("input")`
width:100%;
heigth:100%;
border:none;
padidng:0 3rem;
ouline:none;
border-radius:1.5rem;
background-color:${grayColor};
`

export const SearchField = styled("input")`
padding:1rem;
width:20vmax;
border:none;
outline:none;
border-radius:1.5rem;
background-color:${grayColor};
fon-size:1.1rem
`


export const CurvedButton = styled("button")`
border-radius:1.5rem;
padding:1rem 2rem;
border:none;
outline:none;
cursor:pointer;
background-color:${matBlack};
color:white;
font-size:1rem;
&:hover:{
    background-color:rgba(0,0,0,0.8);
}
`
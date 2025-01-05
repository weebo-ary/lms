import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#444",
        boxShadow: "none",
      }}
    >
      <Toolbar
        sx={{
          padding: 2,
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          FlixElevate{" "}
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize:"16px" }}>
            A product by TheDigitalFlix
          </Typography>
        </Typography>
        
        <Box sx = {{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}>
        <Link to="/login" style={{textDecoration:"none"}}>
          <Typography variant="h6" sx={{ flexGrow: 1, color:"#444"}}>
            Login
          </Typography>
        </Link>
        <Link to="/register" style={{textDecoration:"none"}}>
          <Typography variant="h6" sx={{ flexGrow: 1, color:"#444"}}>
            Register
          </Typography>
        </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

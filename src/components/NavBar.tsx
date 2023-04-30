// components/Navbar.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  ListItem,
  List,
  IconButton,
  Drawer,
} from "@mui/material";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };
  const menuItems = (
    <Box>
      <Button color="inherit">
        <Link href="/">Home</Link>
      </Button>
      <Button color="inherit">
        <Link href="/ds_example">Digital Signature</Link>
      </Button>
      <Button color="inherit">
        <Link href="/vp_example">Zero Knowledge Proof</Link>
      </Button>
    </Box>
  );

  const drawerMenuItems = (
    <List>
      <ListItem button>
        <Link href="/">Home</Link>
      </ListItem>
      <ListItem button>
        <Link href="/ds_example">Digital Signature</Link>
      </ListItem>
      <ListItem button>
        <Link href="/vp_example">Zero Knowledge Proof</Link>
      </ListItem>
    </List>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Cryptography Project
        </Typography>
        {isMobile ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {drawerMenuItems}
            </Drawer>
          </>
        ) : (
          menuItems
        )}
      </Toolbar>
    </AppBar>
  );
}

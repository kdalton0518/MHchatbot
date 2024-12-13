"use client";

import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useAuth } from "./providers/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function TopMenuBar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    redirect("/");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "primary.dark" }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 6,
        }}
      >
        {/* Logo */}
        <Typography
          component="h1"
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "white",
          }}
        >
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
            MHChatbot
          </Link>
        </Typography>

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Typography variant="body1">
            <Link
              href="/llm"
              style={{ color: "white", textDecoration: "none" }}
            >
              Chatbot
            </Link>
          </Typography>
          <Typography variant="body1">
            <Link href="/ss" style={{ color: "white", textDecoration: "none" }}>
              Semantic Search
            </Link>
          </Typography>
          <Typography variant="body1">
            <Link href="/ml" style={{ color: "white", textDecoration: "none" }}>
              ML Classification
            </Link>
          </Typography>
        </Box>

        {/* User Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user === undefined ? (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                href="/auth/login"
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
              >
                Login
              </Button>
              <Button
                href="/auth/register"
                variant="contained"
                sx={{ bgcolor: "secondary.main", color: "white" }}
              >
                Register
              </Button>
            </Box>
          ) : (
            <>
              {user.is_superuser && (
                <Typography variant="body1">
                  <Link
                    href="/users"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Users
                  </Link>
                </Typography>
              )}
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{
                    color: "white",
                  }}
                >
                  <Avatar
                    sx={{ width: 32, height: 32 }}
                    alt={user.first_name + " " + user.last_name}
                    src={user.picture || ""}
                  >
                    {user && user.first_name ? user.first_name[0] : "P"}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Toolbar>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 5,
          sx: {
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <MenuItem>
            {/* <Avatar
              alt={user.first_name + " " + user.last_name}
              src={user.picture || ""}
            /> */}
            Profile
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}

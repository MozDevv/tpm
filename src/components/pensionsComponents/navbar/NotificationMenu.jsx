import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";

function NotificationMenu() {
  const generateNotifications = (count) => {
    const notifications = [];
    const users = ["Alice", "Bob", "Charlie", "David", "Eve"];
    const actions = ["approved", "assessed", "rejected", "updated"];

    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const docNumber = Math.floor(Math.random() * 10000) + 1000; // Generate a random document number
      const notification = `Doc ${docNumber} ${action}`;
      notifications.push({ user, notification });
    }

    return notifications;
  };
  const notifications = generateNotifications(5);
  return (
    <div>
      <Box p={2}>
        <Typography variant="h5" fontSize={16} color="primary">
          Notifications
        </Typography>
        <Typography variant="h5" fontSize={11} mb={-1} sx={{ color: "gray" }}>
          Today
        </Typography>
        <Box>
          {" "}
          <List>
            {notifications.map((notification, index) => (
              <ListItem sx={{ width: "100%" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{ width: "26px", height: "26px" }}
                      src="/bell.png"
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    sx={{
                      ml: -3,
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <Typography sx={{ fontSize: "13px", fontWeight: 500 }}>
                      {notification.notification}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: " 	#C0C0C0",
                      }}
                    >
                      {notification.user}
                    </Typography>
                  </ListItemText>
                </Box>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: " 	#C0C0C0",
                  }}
                >
                  14:50
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </div>
  );
}

export default NotificationMenu;

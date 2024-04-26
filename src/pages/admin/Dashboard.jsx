import { useFetchData } from "6pp"
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material'
import { Box, Container, Paper, Skeleton, Stack, Typography } from '@mui/material'
import moment from 'moment/moment'
import React from 'react'
import WighetComponent from '../../components/WighetComponent'
import AdminLayout from '../../components/layouts/admin/AdminLayout'
import { DoughnutChart, LineChart } from '../../components/specifics/admin/Charts'
import { CurvedButton, SearchField } from '../../components/styles/StyledComponents'
import { server } from '../../constants/config'
import { useErrors } from "../../hooks/hook"

const Dashboard = () => {

  const {
    loading,
    data,
    error
  } = useFetchData(
    `${server}/admin/stats`,
    "dashboard-stats",
  );

  const {stats} = data || {};

  const errors = [
    {
      isError:error,
      error:error
    }
  ]

  useErrors(errors);

  const AppBar = (<Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "2rem 0",
      borderRadius: "1rem"
    }}
  >
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
      <AdminPanelSettingsIcon sx={{
        fontSize: '3rem'
      }} />
      <SearchField />
      <CurvedButton>Search</CurvedButton>
      <Box flexGrow={1} />

      <Typography
        sx={{
          display: {
            xs: "none",
            lg: "block"
          },
          color: "rgba(0,0,0,0.7)",
          textAlign: "center"
        }}
      >
        {
          moment().format("ddd, D MMMM YYYY")

        }
      </Typography>
      <NotificationsIcon />
    </Stack>
  </Paper>)

  const Widgets = <Stack direction={{
    xs: "column",
    sm: "row"
  }}
    justifyContent={"space-between"}
    alignItems={"center"}
    margin={"2rem 0"}
  >
    <WighetComponent title={"Users"} value={stats?.usersCount} icon={<PersonIcon />} />
    <WighetComponent title={"Chats"} value={stats?.totalChatsCount} icon={<GroupIcon />} />
    <WighetComponent title={"Messages"} value={stats?.messagesCount} icon={<MessageIcon />} />
  </Stack>

  return (

    <AdminLayout>
     {
      loading?<Skeleton/>:(
        <Container component={"main"}>
        {
          AppBar
        }
        <Stack direction={{
          xs: "column",
          lg: "row"
        }} flexGrow={"wrap"} justifyContent={"center"} alignItems={{
          xs: "center",
          lg: "stretch"
        }} sx={{
          gap: "2rem"
        }}>
          <Paper
            sx={{
              padding: "2rem 3.5rem",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "45rem"
            }}
          >
            <Typography variant='h4' margin={"2rem 0"}>Last Messages</Typography>
            <LineChart vlaue={stats?.messagesChart || []} />
          </Paper>

          <Paper
            elevation={3}
            sx={{
              padding: "1rem",
              borderRadius: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: {
                xs: "100%",
                sm: "50%"
              },
              position: "relative",
              width: "100%",
              maxWidth: "25rem",
            }}
          >
            <DoughnutChart labels={["Single Chats", "Group Chats"]} vlaue={[
              stats?.totalChatsCount - stats?.groupsCount || 0,
               stats?.groupsCount || 0]} />

            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
            >
              <GroupIcon /> <Typography>Vs</Typography>
              <PersonIcon />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
      )
     }
    </AdminLayout>
  )
}


export default Dashboard
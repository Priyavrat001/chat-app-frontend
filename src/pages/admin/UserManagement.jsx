import { useFetchData } from "6pp";
import { Avatar, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/admin/AdminLayout';
import Table from '../../components/shared/admin/Table';
import { server } from '../../constants/config';
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

const columns = [
  {
  field:"id",
  headerName:"ID",
  headerClassName:"table-header",
  width:150,
},
  {
  field:"avatar",
  headerName:"Avatar",
  headerClassName:"table-header",
  width:200,
  renderCell:(params)=><Avatar alt={params.row.name} src={params.row.avatar}/>
  
},
  {
  field:"name",
  headerName:"Name",
  headerClassName:"table-header",
  width:200
},
  {
  field:"username",
  headerName:"Username",
  headerClassName:"table-header",
  width:200
},
  {
  field:"friends",
  headerName:"Friends",
  headerClassName:"table-header",
  width:150
},
  {
  field:"groups",
  headerName:"Groups",
  headerClassName:"table-header",
  width:200
},
]

const UserManagement = () => {

  const {
    loading,
    data,
    error
  } = useFetchData(
    `${server}/admin/users`,
    "dashboard-users",
  );

  const errors = [
    {
      isError:error,
      error:error
    }
  ];

  useErrors(errors);

  const [rows, setRows] = useState([]);

  useEffect(() => {
   if(data){
    setRows(data?.users?.map(i=>({...i, id: i._id, avatar:transformImage(i.avatar, 50)})))
   }
  }, [data])
  

  return (
    <AdminLayout>
       {
        loading?<Skeleton/>:(
          <Table heading={"All Users"} columns={columns} rows={rows}/>
        )
       }
    </AdminLayout>
  )
}

export default UserManagement
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const ConfirmDeleteDialog = ({open, handleClose, deleteHandler, message}) => {
  return (
    <Dialog open onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
            {message}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>No</Button>
            <Button color="error" onClick={deleteHandler}>Yes</Button>
        </DialogActions>
    </Dialog>
  )
}

export default ConfirmDeleteDialog
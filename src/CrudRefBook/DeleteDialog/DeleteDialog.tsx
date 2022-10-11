import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FC, ReactNode } from "react";
import { Loader as DefaultLoader } from "../Components/Loader";
import "../styles/DeleteDialog.scss"

export type DeleteDialogProps = {
  open?: boolean
  title?: ReactNode
  content?: ReactNode
  onAccepte?: () => void
  onCancel?: () => void
  disabled?: boolean
  isDeleteProcess?: boolean
  Loader?: FC,
  cancelTitle?: ReactNode
  accepteTitle?: ReactNode
}

export function DeleteDialog(props: DeleteDialogProps) {
  const {
    open = false,
    content,
    title,
    onAccepte,
    onCancel,
    disabled,
    isDeleteProcess,
    Loader = DefaultLoader,
    cancelTitle = "Отменить",
    accepteTitle = "Удалить"
  } = props

  return <Dialog
    open={open}
    onClose={isDeleteProcess ? undefined : onCancel}
    className="delete-dialog"
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent dividers>
      <DialogContentText>
        {!isDeleteProcess && content}
      </DialogContentText>
      {isDeleteProcess && <Loader />}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onCancel}
        disabled={disabled || isDeleteProcess}
        variant="outlined"
      >
        {cancelTitle}
      </Button>
      <Button
        color="error"
        onClick={onAccepte}
        disabled={disabled || isDeleteProcess}
        variant="outlined"
      >
        {accepteTitle}
      </Button>
    </DialogActions>
  </Dialog>
}
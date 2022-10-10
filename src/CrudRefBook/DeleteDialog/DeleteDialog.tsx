import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
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
  Loader?: FC
}

export function DeleteDialog(props: DeleteDialogProps) {
  const {
    open = false, content, title, onAccepte, onCancel, disabled, isDeleteProcess, Loader = DefaultLoader
  } = props

  return <Dialog open={open} onClose={isDeleteProcess ? undefined : onCancel} className="delete-dialog">
    <DialogTitle>{title}</DialogTitle>
    <DialogContent dividers>
      {!isDeleteProcess && content}
      {isDeleteProcess && <Loader />}
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onCancel}
        disabled={disabled || isDeleteProcess}
        variant="outlined"
      >
        Отменить
      </Button>
      <Button
        color="error"
        onClick={onAccepte}
        disabled={disabled || isDeleteProcess}
        variant="outlined"
      >
        Удалить
      </Button>
    </DialogActions>
  </Dialog>
}
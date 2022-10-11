import { FORM_STATUS } from "../constants/const"
import { useCallback, useState } from "react"

export type useFormApiResult = {
  formStatus: FORM_STATUS,
  closeForm: () => void
  openForm: (status: FORM_STATUS) => void
}

export default function useDeleteApi() {
  const [isDeleteDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const closeDeleteDialog = useCallback(() => {
    setIsDialogOpen(false)
  }, [setIsDialogOpen])

  const openDeleteDialog = useCallback(() => {
    setIsDialogOpen(true)
  }, [setIsDialogOpen])

  return {
    isDeleteDialogOpen,
    closeDeleteDialog,
    openDeleteDialog
  }
}
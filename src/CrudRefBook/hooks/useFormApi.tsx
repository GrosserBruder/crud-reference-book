import { FORM_STATUS } from "../constants/const"
import { useCallback, useState } from "react"

export type useFormApiResult = {
  formStatus: FORM_STATUS,
  closeForm: () => void
  openForm: (status: FORM_STATUS) => void
}

export default function useFormApi() {
  const [formStatus, setFormStatus] = useState<FORM_STATUS>(FORM_STATUS.CLOSE)

  const closeForm = useCallback(() => {
    setFormStatus(FORM_STATUS.CLOSE)
  }, [setFormStatus])

  const openForm = useCallback((status: FORM_STATUS) => {
    setFormStatus(status)
  }, [setFormStatus])

  return {
    formStatus,
    closeForm,
    openForm
  }
}
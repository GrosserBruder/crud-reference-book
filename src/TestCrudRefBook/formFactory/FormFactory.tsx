//@ts-ignore
import { FORM_STATUS, CrudRefBookFormProps } from "../../CrudRefBook";
import React from "react";
import DhlTypeRefBookForm from "./TestCrudRefBookForm";
import { DhlType } from "../TestCrudRefBook";

export function FormFactory(props: CrudRefBookFormProps<DhlType>) {
  const { formStatus, selectedItem, onSubmit, onClose } = props

  switch (true) {
    case formStatus === FORM_STATUS.CREATE:
      return <DhlTypeRefBookForm
        initialValues={selectedItem}
        onSubmit={onSubmit}
        onClose={onClose}
        isCreate
      />
    case formStatus === FORM_STATUS.UPDATE:
      return <DhlTypeRefBookForm
        initialValues={selectedItem}
        onSubmit={onSubmit}
        onClose={onClose}
        isUpdate
      />
  }
  // ToDo: fix it
  return <></>
}

export default FormFactory
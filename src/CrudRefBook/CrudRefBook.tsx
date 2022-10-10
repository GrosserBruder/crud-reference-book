import "./styles/CrudRefBook.scss"
import { DataItem } from "@grossb/react-data-table"
import { FORM_STATUS } from "./constants/const"
import { RefBook, RefBookProps, FormProps as RefBookFormProps } from "@grossb/reference-book"
import { FC, memo, useCallback, useState } from "react"
import { useFormApi } from "./hooks"
import { Toolbar, ToolbarProps } from "./Toolbar"
import useDeleteApi from "./hooks/useDeleteApi"
import { DeleteDialog, DeleteDialogProps } from "./DeleteDialog/DeleteDialog"
import { Loader as DefaultLoader } from "./Components/Loader";

export type CrudRefBookToolbarProps<T extends DataItem = DataItem> = ToolbarProps<T> & {
  formStatus: FORM_STATUS,
  openForm: (status: FORM_STATUS) => void,
  closeForm: () => void,
}

export type CrudRefBookFormProps = RefBookFormProps & {
  selectedItem?: DataItem
  onSubmit?: (data: any) => Promise<void> | undefined
  formStatus: FORM_STATUS,
  closeForm: () => void,
}

export type CrudRefBookProps<T extends DataItem = DataItem> = Omit<RefBookProps<T>, "Form" | "formOpen" | "Toolbar"> & {
  createHandler?: (data: any) => Promise<any>
  updateHandler?: (data: any) => Promise<any>
  deleteHandler?: (data: any) => Promise<any>
  Form?: FC<CrudRefBookFormProps>
  isLoading?: boolean
  Loader?: FC
  DeleteDialog?: FC<DeleteDialogProps>
  Toolbar?: FC<CrudRefBookToolbarProps<T>>
}

const MemoToolbar = memo(Toolbar) as typeof Toolbar
const MemoDeleteDialog = memo(DeleteDialog) as typeof DeleteDialog

export function CrudRefBook<T extends DataItem = DataItem>(props: CrudRefBookProps<T>) {
  const {
    createHandler,
    updateHandler,
    onRowClick,
    onCloseForm,
    deleteHandler,
    isLoading,
    Loader = DefaultLoader,
    DeleteDialog = MemoDeleteDialog,
    Form,
    Toolbar = MemoToolbar,
    ...otherProps
  } = props


  const { formStatus, closeForm, openForm } = useFormApi()
  const { isDeleteDialogOpen, closeDeleteDialog, openDeleteDialog } = useDeleteApi()

  const [selectedItem, setSelectedItem] = useState<T | undefined>(undefined)
  const [selectedItems, setSelectedItems] = useState<Array<T>>([])
  const [isDeleteProcess, setIsDeleteProcess] = useState<boolean>(false)

  const onRowClickHandler = useCallback((event: any, dataItem: T) => {
    setSelectedItem(dataItem)
    openForm(FORM_STATUS.UPDATE)

    onRowClick?.(event, dataItem)
  }, [setSelectedItem, openForm, onRowClick])

  const onCloseFormHandler = useCallback(() => {
    closeForm()
    setSelectedItem(undefined)

    onCloseForm?.()
  }, [closeForm, onCloseForm])

  const onCreate = useCallback(async (data: any) => {
    if (!createHandler) {
      throw new Error("createHandler is not found")
    }

    return createHandler(data)
  }, [createHandler])

  const onDelete = useCallback(async (data: Array<T>) => {
    if (!deleteHandler) {
      throw new Error("deleteHandler is not found")
    }

    setIsDeleteProcess(true)

    return deleteHandler(data)
      .finally(() => setIsDeleteProcess(false))
  }, [deleteHandler])

  const onUpdate = useCallback((data: any) => {
    if (!updateHandler) {
      throw new Error("updateHandler is not found")
    }

    return updateHandler(data)
  }, [updateHandler])

  const onSubmit = useCallback((data: any) => {

    if (formStatus === FORM_STATUS.UPDATE) {
      return onUpdate(data)
        .then(() => closeForm())
    }
    if (formStatus === FORM_STATUS.CREATE) {
      return onCreate(data)
        .then(() => closeForm())
    }
  }, [formStatus, closeForm, onCreate, onUpdate])

  const onToolbarCreateClick = useCallback(() => {
    openForm(FORM_STATUS.CREATE)
  }, [openForm])

  const onToolbarUpdateClick = useCallback((event: any, selectedData: Array<T>) => {
    const firstOrUndefined = selectedData.length > 0 ? selectedData[0] : undefined

    setSelectedItem(firstOrUndefined)
    openForm(FORM_STATUS.UPDATE)
  }, [openForm])

  const onToolbarDeleteClick = useCallback(() => {
    openDeleteDialog()
  }, [openDeleteDialog])

  const onAccepteDeleteHandler = useCallback(() => {
    onDelete(selectedItems).then(closeDeleteDialog)
  }, [onDelete, closeDeleteDialog, selectedItems])

  if (isLoading) {
    return <div className="crud-ref-book">
      <Loader />
    </div>
  }

  return <div className="crud-ref-book">
    <RefBook
      sortable
      filterable
      selectable
      striped
      Toolbar={Toolbar
        ? (props) => <Toolbar
          {...props}
          formStatus={formStatus}
          openForm={openForm}
          closeForm={closeForm}
          onCreateClick={onToolbarCreateClick}
          onUpdateClick={onToolbarUpdateClick}
          onDeleteClick={onToolbarDeleteClick}
          multipleDelete
        />
        : undefined
      }
      {...otherProps}
      onRowClick={onRowClickHandler}
      Form={Form
        ? (props) => <Form
          {...props}
          formStatus={formStatus}
          closeForm={closeForm}
          onSubmit={onSubmit}
          selectedItem={selectedItem}
        />
        : undefined
      }
      onCloseForm={onCloseFormHandler}
      onSelectChange={setSelectedItems}
      formOpen={formStatus !== FORM_STATUS.CLOSE}
    />
    <DeleteDialog
      open={isDeleteDialogOpen}
      onCancel={closeDeleteDialog}
      isDeleteProcess={isDeleteProcess}
      title="Удаление"
      content="Удалить выбранные записи?"
      onAccepte={onAccepteDeleteHandler}
    />
  </div>
}

export default CrudRefBook
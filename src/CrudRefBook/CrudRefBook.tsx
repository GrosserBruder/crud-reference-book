import "./styles/CrudRefBook.scss"
import { DataItem } from "@grossb/react-data-table"
import { FORM_STATUS } from "./constants/const"
import { RefBook, RefBookProps, FormProps as RefBookFormProps, ToolbarProps as RefBookToolbarProps } from "@grossb/reference-book"
import { FC, memo, ReactNode, useCallback, useState } from "react"
import { useFormApi } from "./hooks"
import { Toolbar } from "./Toolbar"
import { ToolbarProps } from "./Toolbar/Toolbar"
import useDeleteApi from "./hooks/useDeleteApi"
import { DeleteDialog, DeleteDialogProps } from "./DeleteDialog/DeleteDialog"
import { Loader as DefaultLoader } from "./Components/Loader";

export type CrudRefBookFormProps = RefBookFormProps & {
  selectedItem?: DataItem
  onSubmit?: (data: any) => Promise<void> | undefined
  formStatus: FORM_STATUS,
}

export type CrudRefBookProps<T extends DataItem = DataItem> = Omit<RefBookProps<T>, "form" | "formOpen"> & {
  createHandler?: (data: any) => Promise<any>
  updateHandler?: (data: any) => Promise<any>
  deleteHandler?: (data: any) => Promise<any>
  form?: (props: CrudRefBookFormProps) => ReactNode
  isLoading?: boolean
  Loader?: FC
  DeleteDialog?: FC<DeleteDialogProps>
}

const MemoToolbar = memo(Toolbar) as typeof Toolbar
const MemoDeleteDialog = memo(DeleteDialog) as typeof DeleteDialog

export function CrudRefBook<T extends DataItem = DataItem>(props: CrudRefBookProps<T>) {
  const {
    createHandler,
    updateHandler,
    onRowClick,
    form,
    onCloseForm,
    deleteHandler,
    isLoading,
    Loader = DefaultLoader,
    DeleteDialog = MemoDeleteDialog,
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

  const mergedForm = useCallback((props?: RefBookFormProps) => {
    if (formStatus === FORM_STATUS.CLOSE) return;

    const mergedProps: CrudRefBookFormProps = Object.assign({}, props, { formStatus, closeForm, onSubmit, selectedItem })

    return form?.(mergedProps)
  }, [form, selectedItem, formStatus, onSubmit, closeForm])


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

  const defaultToolbar = useCallback((props: RefBookToolbarProps<T>) => {
    const mergedProps: ToolbarProps<T> = Object.assign({}, props, { formStatus, openForm, closeForm })

    return <MemoToolbar<T>
      {...mergedProps}
      onCreateClick={onToolbarCreateClick}
      onUpdateClick={onToolbarUpdateClick}
      onDeleteClick={onToolbarDeleteClick}
      multipleDelete
    />
  }, [
    onToolbarCreateClick,
    onToolbarUpdateClick,
    onToolbarDeleteClick,
    formStatus,
    openForm,
    closeForm
  ])

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
      toolbar={defaultToolbar}
      {...otherProps}
      onRowClick={onRowClickHandler}
      form={mergedForm}
      onCloseForm={onCloseFormHandler}
      onSelectChange={setSelectedItems}
      formOpen={formStatus !== FORM_STATUS.CLOSE}
    />
    <DeleteDialog
      open={isDeleteDialogOpen}
      onCancel={closeDeleteDialog}
      isDeleteProcess={isDeleteProcess}
      title="Удаление"
      content="Удалить выбранные элементы?"
      onAccepte={onAccepteDeleteHandler}
    />
  </div>
}

export default CrudRefBook
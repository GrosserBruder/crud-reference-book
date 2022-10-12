import { ReactNode, useCallback, useMemo } from "react";
import Add from "@mui/icons-material/Add"
import Edit from "@mui/icons-material/Edit"
import Delete from "@mui/icons-material/Delete"
import ToolbarButton, { ToolbarButtonProps } from "./ToolbarButton";
import { AllFilterData, DataItem } from "@grossb/react-data-table";
import "../styles/Toolbar.scss"

export type ToolbarProps<T extends DataItem = DataItem> = {
  children?: ReactNode
  showCreateButton?: boolean
  showUpdateButton?: boolean
  showDeleteButton?: boolean
  onCreateClick?: (event: any, selectedData: Array<T>, filterData?: AllFilterData) => void
  onUpdateClick?: (event: any, selectedData: Array<T>, filterData?: AllFilterData) => void
  onDeleteClick?: (event: any, selectedData: Array<T>, filterData?: AllFilterData) => void
  createButtonProps?: Omit<ToolbarButtonProps, "onClick" | "show">
  updateButtonProps?: Omit<ToolbarButtonProps, "onClick" | "show">
  deleteButtonProps?: Omit<ToolbarButtonProps, "onClick" | "show">
  multipleDelete?: boolean

  selectedData: T[];
  filterData?: AllFilterData;
}


export function Toolbar<T extends DataItem = DataItem>(props: ToolbarProps<T>) {
  const {
    children, showCreateButton = true, showDeleteButton = true, showUpdateButton = true,
    onCreateClick, onDeleteClick, onUpdateClick, createButtonProps, deleteButtonProps,
    updateButtonProps, multipleDelete, selectedData = [], filterData
  } = props;

  const isShowUpdateButton = useMemo(() => {
    if (!showUpdateButton) return false
    return selectedData?.length === 1
  }, [showUpdateButton, selectedData])

  const isShowDeleteButton = useMemo(() => {
    if (!showDeleteButton) return false
    if (multipleDelete) return selectedData?.length >= 1
    return selectedData?.length === 1
  }, [showDeleteButton, multipleDelete, selectedData])

  const onCreateClickHandler = useCallback((event: any) => {
    return onCreateClick?.(event, selectedData, filterData)
  }, [onCreateClick, selectedData, filterData])

  const onUpdateClickHandler = useCallback((event: any) => {
    return onUpdateClick?.(event, selectedData, filterData)
  }, [onUpdateClick, selectedData, filterData])

  const onDeleteClickHandler = useCallback((event: any) => {
    return onDeleteClick?.(event, selectedData, filterData)
  }, [onDeleteClick, selectedData, filterData])


  return <div className="crud-toolbar">
    <ToolbarButton
      icon={<Add />}
      show={showCreateButton}
      label="Создать"
      placeholder="Нажмите, чтобы создать новую запись"
      {...createButtonProps}
      onClick={onCreateClickHandler}
    />

    <ToolbarButton
      icon={<Edit />}
      show={isShowUpdateButton}
      label="Редактировать"
      placeholder="Нажмите, чтобы отредактировать информацию выбранной записи"
      {...updateButtonProps}
      onClick={onUpdateClickHandler}
    />

    <ToolbarButton
      icon={<Delete />}
      show={isShowDeleteButton}
      label="Удалить"
      color="error"
      placeholder={`Нажмите, чтобы удалить  ${multipleDelete ? "выбранные записи" : "выбранную запись"}`}
      {...deleteButtonProps}
      onClick={onDeleteClickHandler}
    />

    {children}
  </div>
}

export default Toolbar
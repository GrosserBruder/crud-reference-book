import { Column, SORTING_ORDER } from "@grossb/react-data-table"
import { DhlType } from "./TestCrudRefBook";

export const columns: Array<Column<DhlType>> = [
  {
    dataField: "name",
    header: "Название",
    headCellProps: {
      width: 500
    },
    sortComparator: (a, b, sortingOrder) => {
      let res = 0;
      if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
        res = -1
      }
      if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
        res = 1
      }

      return sortingOrder === SORTING_ORDER.ASC ? res : res * -1
    }
  }
]
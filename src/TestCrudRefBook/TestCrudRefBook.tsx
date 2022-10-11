import React, { useEffect } from "react";
import { useCallback, useState } from "react";
import { CrudRefBook } from "../CrudRefBook";
import { columns } from "./columns";
import FormFactory from "./formFactory/FormFactory";

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export type DhlType = {
  id: number,
  name: string,
}

const testData = [
  {
    id: 1,
    name: "1"
  },
  {
    id: 2,
    name: "2"
  },
  {
    id: 3,
    name: "3"
  },
]

function TestCrudRefBook() {
  const [data, setData] = useState(testData)
  const [isLoading, setIsLoading] = useState(true)

  const createCallback = useCallback((data: any) => {
    return Promise.resolve(setData((prev) => {
      const maxId = prev.length > 0
        ? Math.max(...prev.map((x) => x.id))
        : 1
      return [...prev, { ...data, id: maxId + 1 }]
    }))
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000)
  }, [])

  const updateCallback = useCallback((data: any) => {
    return Promise.resolve(setData((prev) => {
      const index = prev.findIndex((prevItem) => prevItem.id === data.id)
      const newArray = [...prev]
      newArray[index] = data
      return newArray
    }))
  }, [])

  const deleteCallback = useCallback(async (data: Array<DhlType>) => {
    const ids = data.map((x) => x.id)
    await delay(2000)
    return setData((prev) => prev.filter((prevItem) => !ids.some((id) => prevItem.id === id)))
  }, [])

  return <CrudRefBook<DhlType>
    Form={FormFactory}
    data={data}
    isLoading={isLoading}
    createHandler={createCallback}
    updateHandler={updateCallback}
    deleteHandler={deleteCallback}
    columns={columns}
    disableOpenFormAfterOnRowClick
  />
}

export default TestCrudRefBook;
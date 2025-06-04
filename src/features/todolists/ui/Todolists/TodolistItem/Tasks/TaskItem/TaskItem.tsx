import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { TaskStatus } from "@/common/enums"
import { useAppDispatch } from "@/common/hooks"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types"
import { deleteTaskTC, updateTaskTC } from "@/features/todolists/model/tasks-slice"
import type { DomainTodolist } from "@/features/todolists/model/todolists-slice"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { useUpdateTaskMutation } from "@/features/todolists/api/tasksApi"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const TaskItem = ({ task, todolist }: Props) => {
  const [updateTask] = useUpdateTaskMutation()

  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId: todolist.id, taskId: task.id }))
  }

  // Чтобы избавиться от дублирования кода в changeTaskStatus и changeTaskTitle,
  // можно вынести создание объекта model в отдельную функцию, которая будет принимать
  // только те поля, которые изменяются. Остальные поля возьмутся из текущего состояния задачи
  // (task).
  const getUpdateModel = (updates: Partial<UpdateTaskModel>): UpdateTaskModel => {
    return {
      status: updates.status ?? task.status,
      title: updates.title ?? task.title,
      deadline: updates.deadline ?? task.deadline,
      description: updates.description ?? task.description,
      priority: updates.priority ?? task.priority,
      startDate: updates.startDate ?? task.startDate,
    }
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New

    const model = getUpdateModel({ status })

    // const model: UpdateTaskModel = {
    //   status,
    //   title: task.title,
    //   deadline: task.deadline,
    //   description: task.description,
    //   priority: task.priority,
    //   startDate: task.startDate,
    // }

    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const changeTaskTitle = (title: string) => {
    const model = getUpdateModel({ title })

    // const model: UpdateTaskModel = {
    //   status: task.status,
    //   title,
    //   deadline: task.deadline,
    //   description: task.description,
    //   priority: task.priority,
    //   startDate: task.startDate,
    // }

    updateTask({ taskId: task.id, todolistId: todolist.id, model })
  }

  const isTaskCompleted = task.status === TaskStatus.Completed
  const disabled = todolist.entityStatus === "loading"

  return (
    <ListItem sx={getListItemSx(isTaskCompleted)}>
      <div>
        <Checkbox checked={isTaskCompleted} onChange={changeTaskStatus} disabled={disabled} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={disabled} />
      </div>
      <IconButton onClick={deleteTask} disabled={disabled}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}

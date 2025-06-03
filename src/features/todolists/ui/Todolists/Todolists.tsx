import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"
import { TodolistItem } from "./TodolistItem/TodolistItem"
import { useGetTodolistsQuery } from "../../api/todolistsApi"

export const Todolists = () => {
  const { data: todolists, refetch } = useGetTodolistsQuery()

  return (
    <>
      <div>
        <button onClick={refetch}>Получить свежие данные</button>
      </div>
      {todolists?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}

import type { BaseResponse } from "@/common/types"
import type { DomainTask, GetTasksResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, string /* todolistId */>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      providesTags: (result, error, todolistId) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: "Task" as const, id })), // по одному на каждую задачу
              { type: "Task", id: todolistId }, // общий тег на список задач
            ]
          : [{ type: "Task", id: todolistId }],
    }),

    createTask: builder.mutation<BaseResponse<{ item: DomainTask }>, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: (result, error, { todolistId }) => [
        { type: "Task", id: todolistId },
        { type: "Todolist", id: todolistId },
      ],
    }),

    updateTask: builder.mutation<
      BaseResponse<{ item: DomainTask }>,
      { todolistId: string; taskId: string; model: UpdateTaskModel }
    >({
      query: ({ todolistId, taskId, model }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "PUT",
        body: model,
      }),
      invalidatesTags: (result, error, { taskId }) => [{ type: "Task", id: taskId }],
    }),

    deleteTask: builder.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      query: ({ todolistId, taskId }) => ({
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { todolistId }) => [
        { type: "Task", id: todolistId },
        { type: "Todolist", id: todolistId },
      ],
    }),
  }),
})

// Экспортируем хуки
export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi

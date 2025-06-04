// Во избежание ошибок импорт должен быть из `@reduxjs/toolkit/query/react`
import { DomainTodolist } from "../model/todolists-slice"
import { Todolist } from "./todolistsApi.types"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi"

// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Типизация аргументов (<возвращаемый тип, тип query аргументов (`QueryArg`)>)
    // `query` по умолчанию создает запрос `get` и указание метода необязательно
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      providesTags: ["Todolist"],
    }),
    addTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title) => ({
        url: "todo-lists",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `todo-lists/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todolist"],
    }),
    updateTodolistTitle: build.mutation<BaseResponse, { id: string; title: string }>({
      query: ({ id, title }) => ({
        url: `todo-lists/${id}`,
        method: "PUT",
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

// `createApi` создает объект `API`, который содержит все эндпоинты в виде хуков,
// определенные в свойстве `endpoints`
export const {
  useGetTodolistsQuery,
  useAddTodolistMutation,
  useRemoveTodolistMutation,
  useUpdateTodolistTitleMutation,
} = todolistsApi

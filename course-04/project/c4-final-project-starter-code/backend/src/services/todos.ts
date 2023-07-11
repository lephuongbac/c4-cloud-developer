import { TodoAccess } from '../dataAccess/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic
export class TodoModel {
  todoAccess: TodoAccess
  constructor() {
    this.todoAccess = new TodoAccess()
  }
  async getAll(userId: string) {
    return this.todoAccess.getAllTodos(userId)
  }
  async create({
    payload,
    userId
  }: {
    userId: string
    payload: CreateTodoRequest
  }): Promise<TodoItem> {
    const newTodo = {
      todoId: uuid.v4(),
      createdAt: new Date().toISOString(),
      done: false,
      userId,
      ...payload
    }

    return await this.todoAccess.create(newTodo)
  }
  async delete({
    todoId,
    userId
  }: {
    todoId: string
    userId: string
  }): Promise<void> {
    await this.todoAccess.delete(todoId, userId)
  }
  async update({
    todoId,
    userId,
    payload
  }: {
    todoId: string
    userId: string
    payload: UpdateTodoRequest
  }): Promise<void> {
    await this.todoAccess.update(todoId, userId, payload)
  }

  async generateUploadUrl({
    todoId,
    userId
  }: {
    todoId: string
    userId: string
  }) {
    const imageId = uuid.v4()
    const attachmentUrl = AttachmentUtils.getAttachmentUrl(imageId)

    const uploadUrl = AttachmentUtils.getUploadUrl(imageId)

    await this.todoAccess.updateAttachmentUrl(todoId, userId, attachmentUrl)

    return uploadUrl
  }
}

export const todoModel = new TodoModel()

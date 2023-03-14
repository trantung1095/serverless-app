import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')
const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

import { v4 as uuidv4 } from 'uuid'

export async function getTodosForUser(userId: string): Promise<any> {
  logger.info(`Get todo for user: ${userId}`)

  return await todoAccess.getTodos(userId)
}

// TODO: Implement businessLogic
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info(`Create todo for user: ${userId}`)

  const newItem: TodoItem = {} as TodoItem
  newItem.userId = userId
  newItem.todoId = uuidv4()
  newItem.createdAt = new Date().toISOString()
  newItem.name = createTodoRequest.name
  newItem.dueDate = createTodoRequest.dueDate
  newItem.done = false

  return await todoAccess.createTodo(newItem)
}

export async function updateTodo(
  todoId: string,
  userId: string,
  UpdateTodoRequest: UpdateTodoRequest
) {
  logger.info(`Update todo for user: ${userId}`)

  await todoAccess.updateTodo(todoId, userId, UpdateTodoRequest)
}

export async function deleteTodo(todoId: string, userId: string) {
  logger.info(`Delete todo for user: ${userId}`)

  await todoAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Create attachment presigned url')

  const dbUrl: string = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
  const attachmentUrl: string = attachmentUtils.getSignedUrl(todoId)

  await todoAccess.updateAttachmentForTodo(todoId, userId, dbUrl)

  return attachmentUrl
}

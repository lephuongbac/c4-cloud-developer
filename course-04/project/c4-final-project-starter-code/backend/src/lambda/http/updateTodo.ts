import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { todoModel } from '../../services/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload: UpdateTodoRequest = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    try {
      await todoModel.update({ todoId, userId, payload })

      return {
        statusCode: 200,
        body: ''
      }
    } catch (error: any) {
      logger.error(`Failed to update todo: ${error.message}`)

      return {
        statusCode: 500,
        body: `${error.message}`
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

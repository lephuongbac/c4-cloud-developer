import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

if (process.env._X_AMZN_TRACE_ID) {
  const XAWS = AWSXRay.captureAWS(AWS)
}

const logger = createLogger('TodosAccess')

const TODOS_TABLE = process.env.TODOS_TABLE

const client = new AWS.DynamoDB.DocumentClient()

// TODO: Implement the dataLayer logic
export class TodoAccess {
  async getAllTodos(userId: string) {
    console.log('AAA')
    const result = await client
      .query({
        TableName: TODOS_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: { ':userId': userId },
        ScanIndexForward: false
      })
      .promise()

    return result.Items
  }
  async create(todoItem: TodoItem) {
    await client
      .put({
        TableName: TODOS_TABLE,
        Item: todoItem
      })
      .promise()
    return todoItem
  }
  async delete(todoId: string, userId: string) {
    await client
      .delete({
        TableName: TODOS_TABLE,
        Key: { todoId, userId }
      })
      .promise()
  }
  async update(
    todoId: string,
    userId: string,
    todoUpdate: Partial<TodoUpdate>
  ) {
    await client
      .update({
        TableName: TODOS_TABLE,
        Key: { todoId, userId },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        },
        ExpressionAttributeNames: { '#name': 'name' }
      })
      .promise()
    return todoUpdate
  }
  async updateAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ) {
    return client
      .update({
        TableName: TODOS_TABLE,
        Key: { todoId, userId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: { ':attachmentUrl': attachmentUrl }
      })
      .promise()
  }
}

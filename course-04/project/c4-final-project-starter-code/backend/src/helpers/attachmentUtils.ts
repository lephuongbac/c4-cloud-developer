import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

AWSXRay.captureAWS(AWS)

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export class AttachmentUtils {
  static getUploadUrl(todoId: string): string {
    return s3.getSignedUrl('putObject', {
      Bucket: process.env.ATTACHMENT_S3_BUCKET,
      Expires: process.env.SIGNED_URL_EXPIRATION,
      Key: todoId
    })
  }

  static getAttachmentUrl(attachmentKey: string): string {
    return `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${attachmentKey}`
  }
}

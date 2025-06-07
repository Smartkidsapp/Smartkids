export enum SuccessResponseEnum {
  OK = 'OK',
  CREATED = 'CREATED',
  EMAIL_VERIFICATION_PENDING = 'EMAIL_VERIFICATION_PENDING',
}

export class SuccessResponse<T> {
  message?: string;
  status: string = SuccessResponseEnum.OK;
  data?: T;

  constructor(
    status: string = SuccessResponseEnum.OK,
    message = undefined,
    data?: T,
  ) {
    this.data = data;
    this.status = status;
    this.message = message;
  }
}

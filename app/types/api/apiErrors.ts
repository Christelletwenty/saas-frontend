import { ApiFieldError } from "./apiTypes";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly fieldErrors?: ApiFieldError[];

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    fieldErrors?: ApiFieldError[];
  }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors;
  }
}

export type ApiSuccess = {
  success: true;
  message: string;
  data: any;
};

export type ApiFieldError = {
  field?: string;
  message: string;
};

export type ApiErrorPayload = {
  success: false;
  message: string;
  errors?: ApiFieldError[];
  code?: string;
};

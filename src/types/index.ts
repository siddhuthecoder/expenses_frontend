export interface Event {
  _id: string;
  title: string;
  description?: string;
  date: string;
  createdAt: string;
}

export interface Expense {
  _id: string;
  eventId: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    createdAt: string;
  };
  description: string;
  amount: number;
  spentOn: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  errors?: Array<{ msg: string; param: string }>;
}
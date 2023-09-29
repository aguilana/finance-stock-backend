class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message); // Calls the constructor of the Error class
    this.status = status;
  }
}

export default CustomError;

import { AaaException } from './AaaException';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(AaaException)
export class AaaFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    console.log('哇哇哇', 'exception', exception, 'host', host);
    host;
  }
}

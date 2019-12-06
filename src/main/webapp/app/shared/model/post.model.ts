import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';

export interface IPost {
  id?: number;
  title?: string;
  content?: string;
  creationDate?: Moment;
  creator?: IUser;
}

export class Post implements IPost {
  constructor(public id?: number, public title?: string, public content?: string, public creationDate?: Moment, public creator?: IUser) {}
}

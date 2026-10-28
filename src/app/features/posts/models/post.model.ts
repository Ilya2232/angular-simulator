export interface IPost {
  id: number;
  userId: number;
  title: string;
  body: string;
  tags: string[];
  reactions: { likes: number, dislikes: number };
  views: number
}

export interface IPostResponse {
  posts: IPost[];
  total: number;
  skip: number;
  limit: number;
}

export type IPostCreate = Omit<IPost, 'id'>;
export type IPostEdit = Pick<IPost, 'title' | 'tags' | 'views'>;
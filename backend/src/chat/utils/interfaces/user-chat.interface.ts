import { Socket } from 'socket.io';

export interface UserChat {
  socket: Socket;
  username: string;
}

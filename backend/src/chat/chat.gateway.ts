import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserChat } from './utils/interfaces/user-chat.interface';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway');
  private users: UserChat[] = [];

  afterInit(server: Server): void {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.users = this.users.filter((user) => user.socket.id !== client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ): void {
    this.users.push({ socket: client, username });
    this.logger.log(`User registered: ${username} (${client.id})`);
  }

  @SubscribeMessage('private_message')
  handlePrivateMessage(
    @MessageBody() payload: { recipient: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const sender = this.users.find((user) => user.socket.id === client.id);
    const recipient = this.users.find(
      (user) => user.username === payload.recipient,
    );

    if (sender && recipient) {
      recipient.socket.emit('private_message', {
        sender: sender.username,
        message: payload.message,
      });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() payload: { recipient: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const sender = this.users.find((user) => user.socket.id === client.id);
    const recipient = this.users.find(
      (user) => user.username === payload.recipient,
    );

    if (sender && recipient) {
      recipient.socket.emit('typing', {
        sender: sender.username,
      });
    }
  }

  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @MessageBody() payload: { recipient: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const sender = this.users.find((user) => user.socket.id === client.id);
    const recipient = this.users.find(
      (user) => user.username === payload.recipient,
    );

    if (sender && recipient) {
      recipient.socket.emit('stop_typing', {
        sender: sender.username,
      });
    }
  }
}

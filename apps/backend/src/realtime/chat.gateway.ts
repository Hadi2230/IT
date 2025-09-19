import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleConnection(client: Socket) {
    // no-op: client connects
  }

  joinTicketRoom(client: Socket, ticketId: string) {
    client.join(`ticket:${ticketId}`);
  }

  notifyNewMessage(ticketId: string, message: unknown) {
    void this.server.to(`ticket:${ticketId}`).emit('message:new', message);
  }
}

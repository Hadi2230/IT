import { OnGatewayConnection, WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/remote', cors: { origin: true, credentials: true } })
export class RemoteGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection() {}

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { code: string; role: 'agent' | 'client' }, @ConnectedSocket() client: Socket) {
    const room = `remote:${data.code}`;
    client.join(room);
    client.data.role = data.role;
    this.server.to(room).emit('presence', { id: client.id, role: data.role, type: 'join' });
  }

  @SubscribeMessage('signal')
  handleSignal(@MessageBody() data: { code: string; payload: any }, @ConnectedSocket() client: Socket) {
    const room = `remote:${data.code}`;
    client.to(room).emit('signal', { from: client.id, payload: data.payload });
  }

  @SubscribeMessage('control')
  handleControl(@MessageBody() data: { code: string; event: any }, @ConnectedSocket() client: Socket) {
    const room = `remote:${data.code}`;
    client.to(room).emit('control', { from: client.id, event: data.event });
  }
}


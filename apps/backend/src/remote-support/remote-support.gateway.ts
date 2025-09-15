import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { RemoteSocketRole } from './remote-support.dtos';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/ws/remote', cors: { origin: true, credentials: true } })
export class RemoteSupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly jwt: JwtService) {}

  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const token = (client.handshake.auth?.token || client.handshake.query?.token) as string | undefined;
    if (!token) return client.disconnect(true);
    try {
      const payload = await this.jwt.verifyAsync<{ sid: string; role: RemoteSocketRole }>(token as string);
      const room = `remote:${payload.sid}`;
      client.data.role = payload.role;
      client.join(room);
      this.server.to(room).emit('presence', { role: payload.role, connected: true });
    } catch {
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket) {
    const role = client.data?.role as RemoteSocketRole | undefined;
    const rooms = [...client.rooms];
    for (const room of rooms) {
      if (room.startsWith('remote:')) this.server.to(room).emit('presence', { role, connected: false });
    }
  }

  @SubscribeMessage('offer')
  onOffer(client: Socket, payload: { sdp: any }) {
    this.forward(client, 'offer', payload);
  }

  @SubscribeMessage('answer')
  onAnswer(client: Socket, payload: { sdp: any }) {
    this.forward(client, 'answer', payload);
  }

  @SubscribeMessage('candidate')
  onCandidate(client: Socket, payload: { candidate: any }) {
    this.forward(client, 'candidate', payload);
  }

  private forward(client: Socket, event: string, payload: unknown) {
    const rooms = [...client.rooms].filter((r) => r.startsWith('remote:'));
    for (const room of rooms) {
      client.to(room).emit(event, payload);
    }
  }
}


import { BroadcastMessageType } from "./BroadcastMessageType";

export interface BroadcastMessage<TPayload> {
  type: BroadcastMessageType;
  sender: string;
  payload: TPayload;
}

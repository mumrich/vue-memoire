import { BroadcastMessageType } from "./BroadcastMessageType";

export interface BroadcastMessage<TPayload extends object> {
  type: BroadcastMessageType;
  sender: string;
  payload: TPayload;
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ collection: 'Users' })
export class UserDocument extends Document<string, object, UserDocument> {
  @Prop({ default: uuid(), required: true })
  _id: string = '';

  @Prop()
  avatar?: string;

  @Prop({ required: true })
  displayName: string = '';

  @Prop({ required: true })
  email: string = '';

  @Prop({ required: true, unique: true, lowercase: true })
  emailLowered: string = '';

  @Prop()
  googleId?: string;

  @Prop({ required: true, default: () => new Date() })
  memberSince: Date = new Date();
}

export const UsersSchema = SchemaFactory.createForClass(UserDocument);

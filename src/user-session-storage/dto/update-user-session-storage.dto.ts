import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSessionStorageDto } from './create-user-session-storage.dto';

export class UpdateUserSessionStorageDto extends PartialType(CreateUserSessionStorageDto) {}

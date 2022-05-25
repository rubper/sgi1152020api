import { UUID } from 'types/uuid.type';

export const UUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUUIDValid = (uuid: UUID) => {  
  if (uuid.length < 1) {
    return false;
  }
  return UUIDRegex.test(uuid);
}
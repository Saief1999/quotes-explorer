import { IsMongoId } from "class-validator";

export class RequestParamDto {
    @IsMongoId({ message: "Please give a valid ID" })
    id: string;
  }
  
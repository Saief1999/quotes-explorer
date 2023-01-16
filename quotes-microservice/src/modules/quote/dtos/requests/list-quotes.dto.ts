import { IsMongoId, IsNumber } from "class-validator";

export class ListQuotesDto {

    @IsNumber()
    offset: number;

    @IsNumber()
    limit: number
}
  
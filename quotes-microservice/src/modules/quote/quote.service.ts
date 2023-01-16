import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseService } from "src/generics/services/base.service";
import { Quote } from "src/models/quote.model";

@Injectable()
export class QuoteService extends BaseService<Quote>{
    constructor(
        @InjectModel(Quote.name) model
    ) {
        super(model)
    }
}
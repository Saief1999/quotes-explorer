import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { makeCounterProvider } from "@willsoto/nestjs-prometheus";
import { Quote, QuoteSchema } from "src/models/quote.model";
import { QuoteController } from "./quote.controller";
import { QuoteService } from "./quote.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Quote.name, schema: QuoteSchema }])
    ],
    controllers: [QuoteController],
    providers: [QuoteService,
        makeCounterProvider({
            name: "number_of_requests",
            help: "counts the number of requests that each endpoint received",
            labelNames: ['status', 'endpoint', 'req_id']
        }),
        makeCounterProvider({
            name: "searched_quotes",
            help: "counts the number of searched quotes",
            labelNames: ['quote', 'client']
        }),
    ],
})
export class QuoteModule { }
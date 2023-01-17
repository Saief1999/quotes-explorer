import { Body, Controller, Delete, Get, HttpException, Logger, Param, Post, Put, Query, Request } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter } from "prom-client";
import { Quote } from "src/models/quote.model";
import { ListQuotesDto } from "./dtos/requests/list-quotes.dto";
import { RequestParamDto } from "./dtos/requests/request-param.dto";
import { QuoteService } from "./quote.service";
import { v4 as uuidv4 } from 'uuid';
import tracer from "src/tracing";

@Controller("quotes")
export class QuoteController {
  constructor(private readonly quoteService: QuoteService,
    @InjectMetric("number_of_requests") private counter: Counter<string>,
    @InjectMetric("searched_quotes") private searchesCounter: Counter<string>,
  ) {
  }

  private readonly logger = new Logger(QuoteController.name);

  @Get(":id")
  async getQuote(@Request() request, @Param() params: RequestParamDto) {
    const requestId = uuidv4();

    const span = tracer.startSpan('get_quote');
    span.setTag("client", request.ip);
    span.setTag("req_id", requestId);

    const response = await this.quoteService.findOne(params.id)

    this.counter.inc({ status: "200", endpoint: request.url })
    this.searchesCounter.inc({ quote: params.id, client: request.ip })
    this.logger.log({ requestId, client: request.ip }, `Quote searched`);

    span.finish();
    return response
  }

  @Get()
  async listQuotes(@Request() request, @Query() query: ListQuotesDto): Promise<Quote[]> {
    const requestId = uuidv4();

    const span = tracer.startSpan('list_quotes');
    span.setTag("client", request.ip);
    span.setTag("req_id", requestId);

    const response = await this.quoteService.findAll(
      undefined,
      undefined,
      {
        skip: query.offset,
        limit: query.limit
      }
    );


    this.counter.inc({ status: "200", endpoint: request.url })
    this.logger.log({ requestId, client: request.ip }, `Quotes listed`)

    span.finish();
    return response
  }

  @Post()
  async createQuote(@Request() request, @Body() quote: Quote) {
    const requestId = uuidv4();

    const span = tracer.startSpan('create_quote');
    span.setTag("client", request.ip);
    span.setTag("req_id", requestId);

    const response = await this.quoteService.create(quote);


    this.counter.inc({ status: "200", endpoint: request.url })
    this.logger.log({ requestId, client: request.ip }, `Quote created`)

    span.finish();
    return response;
  }

  @Put(":id")
  async updateQuote(
    @Request() request,
    @Param() params: RequestParamDto,
    @Body() quote: Quote
  ) {

    const span = tracer.startSpan('create_quote');
    const requestId = uuidv4();

    span.setTag("client", request.ip);
    span.setTag("req_id", requestId);

    const { id } = params;
    const response = await this.quoteService.update(id, quote);


    this.counter.inc({ status: "200", endpoint: request.url })
    this.logger.log({ requestId, cendlient: request.ip }, `Quote updated`)

    span.finish();
    return response
  }

  @Delete(":id")
  async removeQuote(@Request() request, @Param("id") id: string) {

    const span = tracer.startSpan('create_quote');
    const requestId = uuidv4();

    span.setTag("client", request.ip);
    span.setTag("req_id", requestId);

    const response = await this.quoteService.remove(id);

    this.counter.inc({ status: "200", endpoint: request.url })
    this.logger.log({ requestId, client: request.ip }, `Quote updated`)

    span.finish();
    return response;
  }

}
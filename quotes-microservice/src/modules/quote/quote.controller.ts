import { Body, Controller, Delete, Get, HttpException, Logger, Param, Post, Put, Query, Request } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter } from "prom-client";
import { Quote } from "src/models/quote.model";
import { ListQuotesDto } from "./dtos/requests/list-quotes.dto";
import { RequestParamDto } from "./dtos/requests/request-param.dto";
import { QuoteService } from "./quote.service";
import { v4 as uuidv4 } from 'uuid';

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
    const response = await this.quoteService.findOne(params.id)

    const requestId = uuidv4();
    this.counter.inc({ status: "200", endpoint: request.url, 'req_id': requestId })
    this.searchesCounter.inc({ quote: params.id, client: request.ip })
    this.logger.log(`Quotes searched ${requestId} ${request.ip}`)
    return response
  }

  @Get()
  async listQuotes(@Request() request, @Query() query: ListQuotesDto): Promise<Quote[]> {
    const response = await this.quoteService.findAll(
      undefined,
      undefined,
      {
        skip: query.offset,
        limit: query.limit
      }
    );

    const requestId = uuidv4();

    this.counter.inc({ status: "200", endpoint: request.url, 'req_id': requestId })
    this.logger.log(`Quotes listed ${requestId} ${request.ip}`)

    return response
  }

  @Post()
  async createQuote(@Request() request, @Body() quote: Quote) {
    const response = await this.quoteService.create(quote);

    const requestId = uuidv4();

    this.counter.inc({ status: "200", endpoint: request.url, 'req_id': requestId })
    this.logger.log(`Quote created ${requestId} ${request.ip}`)

    return response;
  }

  @Put(":id")
  async updateQuote(
    @Request() request,
    @Param() params: RequestParamDto,
    @Body() quote: Quote
  ) {

    const { id } = params;
    const response = await this.quoteService.update(id, quote);

    const requestId = uuidv4();

    this.counter.inc({ status: "200", endpoint: request.url, 'req_id': requestId })
    this.logger.log(`Quote updated ${requestId} ${request.ip}`)

    return response
  }

  @Delete(":id")
  async removeQuote(@Request() request, @Param("id") id: string) {
    const response = await this.quoteService.remove(id);

    const requestId = uuidv4();

    this.counter.inc({ status: "200", endpoint: request.url, 'req_id': requestId })
    this.logger.log(`Quote removed ${requestId} ${request.ip}`)

    return response;
  }

}
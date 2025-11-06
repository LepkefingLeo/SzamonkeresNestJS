import { Controller, Get, Post, Render, Body, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';

export interface DTO {
  name: string;
  email: string;
  date: string;
  viewers: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    const errors: string[] = [];
    const body: DTO = {
      name: '',
      email: '',
      date: '',
      viewers: '',
    };
    return { errors, data: body };
  }

  @Get('success')
  @Render('success')
  getSuccess() {
    return {};
  }

  @Post('submit')
  async handleSubmit(@Body() body: DTO, @Res() response: Response) {
    const errors: string[] = [];
    const guests: number = parseInt(body.viewers);

    if (!body.name?.trim()) errors.push('A név megadása kötelező.');
    if (!body.email?.trim()) {
      errors.push('Az e-mail megadása kötelező.');
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(body.email)) {
      errors.push('Érvényes e-mail címet adjon meg (pl. valaki@domain.hu).');
    }

    if (!body.date) {
      errors.push('A dátum megadása kötelező.');
    } else {
      const selectedDate = new Date(body.date);
      const now = new Date();

      if (selectedDate.getTime() < now.getTime()) {
        errors.push('A dátum nem lehet régebbi a mai napnál.');
      }
    }

    if (!body.viewers) {
      errors.push('A vendégek száma kötelező.');
    } else if (isNaN(guests) || guests < 1 || guests > 10) {
      errors.push('A vendégek száma 1 és 10 között lehet.');
    }

    if (errors.length > 0) {
      console.log('Validation errors:', { errors, data: body });
      return response
        .status(HttpStatus.BAD_REQUEST)
        .render('index', { errors, data: body });
    } else {
      await this.appService.saveFormData(body, guests);
      return response.redirect('/success');
    }
  }
}

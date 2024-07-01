import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GeminisService {

  createModel() {
    const googleGenAI = new GoogleGenerativeAI(environment.API_KEY);
    return googleGenAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    /*
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 1000,
      responseMimeType: "text/plain",
    };

    const model = googleGenAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      ...generationConfig
    }); */
  }
}

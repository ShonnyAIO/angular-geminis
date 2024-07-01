import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GenerativeModel } from '@google/generative-ai';
import { GeminisService } from '../services/geminis/geminis.service';
import { RECIPE } from '../prompts/food.prompts';

interface Recipe {
  name: string;
  country: string;
  ingredients: string[];
  recipe: string;
  details: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  model: GenerativeModel;
  geminiService = inject(GeminisService);
  recipe = signal<Recipe | null>(null);
  imgPreview = signal('');

  constructor() {
    this.model = this.geminiService.createModel();
  }

  async getFile(event: Event) {
    this.imgPreview.set('');
    this.recipe.set(null);

    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    const data = await this.fileToGenerativePart(file);
    this.generateRecipe(data);
  }

  async fileToGenerativePart(file: File) {
    const base64EncodedDataPromise = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });

    const img = await base64EncodedDataPromise;
    this.imgPreview.set(`data:image/png;base64, ${img}`);
    return {
      inlineData: { data: img, mimeType: file.type },
    };
  }

  async generateRecipe(data: any) {
    if (!this.model) return;
    try {
      const result = await this.model.generateContent([RECIPE, data]);

      const response = result.response;
      this.recipe.set(this.parseResponse(response.text()));
    } catch (error) {
      console.error(error);
    }
  }

  parseResponse(response: string) {
    const res = response.replace(new RegExp('```', 'g'), '');
    return JSON.parse(res) as Recipe;
  }

  ngOnInit(): void {
    // this.TestGemini();
  }

  /*
  ESTO ES PARA QUE PUEDA GENERAR EL CONTENIDO ESTILO STREAM
  async TestGemini(){
    const prompt = 'Que sabes sobre Venezuela ?';
    // const result = await model.generateContent(prompt);
    // const response = result.response;
    // console.log('RESPUESTA GEMINIS: ', response);
    // this.result.set(response.text());
    const streamingResponse = await model.generateContentStream(prompt);
    console.log('RESPUESTA GEMINIS: ', streamingResponse);
    for await (const item of streamingResponse.stream){
      this.result.update(prev => prev + item.text());
    }
  } */

}
